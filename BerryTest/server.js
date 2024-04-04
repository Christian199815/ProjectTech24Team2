console.log(`Start "Project: Tech" server`);

/******* DOT ENV *******/

const dotenv = require("dotenv");
dotenv.config();

/******* EXPRESS *******/

const express = require("express");
// Express luistert naar poort 3000 voor requests van clients
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log("Luisterend naar poort 3000");
  connectDB().catch(console.dir);
  // poort nummer (arbitrair), callback function
});

/******* EXPRESS-VALIDATOR *******/

const { query, body, validationResult } = require("express-validator");

const bezoekerSchema = [
  body("voornaam")
    .escape() // escape() is een voorbeeld van sanition en voorkomt cross-site scripting (XSS), maakt text van html tags (zoals <script>)
    .notEmpty()
    .isString()
    .isAlpha()
    .withMessage("Gebruik alleen letters in de voornaam."),
  body("achternaam").escape().notEmpty().isString(),
  body("email")
    .escape()
    .isEmail()
    .withMessage("Gebruik een geldig e-mailadres"),
  body("wachtwoord").notEmpty().withMessage("Vul een wachtwoord in"),
];

const loginSchema = [
  body("email")
    .escape()
    .isEmail()
    .notEmpty()
    .withMessage("Gebruik een geldig e-mailadres"),
  body("wachtwoord").escape().notEmpty().withMessage("Vul een wachtwoord in"),
];

/******* EXPRESS-SESSION *******/

const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_KEY, // secret key for session encryption
    resave: false,
    saveUninitialized: true,
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next(); // User is logged in, continue to the next middleware
  } else {
    res.redirect("/login"); // Redirect to the login page if not logged in
  }
};

/******* Embedded JavaScript Templates (EJS) *******/

app.set("view engine", "ejs");

/******* MONGO DB *******/

// ATLAS MONGO DB APPLICATION CODE
const { MongoClient, ObjectId } = require("mongodb");
// Mongo configuratie uit .env bestand
const uri = process.env.URI;
// nieuwe MongoDB client
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME);

// MongoDB connection
async function connectDB() {
  try {
    await client.connect();
    console.log("Client connected to database");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

/******** MIDDLEWARE **********/

// Middleware zijn functies (methods) die je in een Express route handler kan gebruiken
// Gebruik urlencoded en json om de data uit het formulier te verwerken
// Body parser is deprecated (https://stackoverflow.com/questions/66548302/body-parser-deprecated)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Maak json-object van de string die door het formulier wordt doorgestuurd naar de route

/******* BCRYPT *******/

const bcrypt = require("bcryptjs");
// Password hashing and salting with bcrypt
async function hashData(data) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedData = await bcrypt.hash(data, salt);
    return hashedData;
  } catch (error) {
    console.log("Error hashing password: ", error);
  }
}

// Compare given and stored data
async function compareData(plainTextData, hashedData) {
  try {
    // Compare the plain text data with the hashed data
    const match = await bcrypt.compare(plainTextData, hashedData);
    return match;
  } catch (error) {
    console.error("Error comparing data:", error);
    throw error;
  }
}

/******* MULTER (file upload)  ******* (Formidable als alternatief?)*/
const path = require("path"); // to get file extension of uploaded file from req.file.filename

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the folder where files will be saved
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    // Create a custom file name with the original file extension
    // Use the original file name, a timestamp, and the original extension for uniqueness and clarity
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

/******* ROUTES  *******/

app.get("/hallo", (req, res) => {
  res.send(`Hallo, ${req.query.person}!`);
});

app.get("/nieuwe-bezoeker", (req, res) => {
  res.render("nieuwe-bezoeker");
});

app.post(
  "/nieuwe-bezoeker",
  upload.single("avatar"),
  bezoekerSchema,
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      console.log("Request data: ", req.body, req.file);
      const postData = req.body;
      // voeg het pad naar het geuploade bestand toe aan de postData die naar de database gaat
      postData.avatar = req.file.filename;
      console.log("Avatar link", postData.avatar);
      // Hash the password
      postData.wachtwoord = await hashData(postData.wachtwoord);
      // SLA BEZOEKER OP IN DB
      const logBezoeker = await db.collection("bezoekers").insertOne(postData);
      const bericht = `Bezoeker ${postData.voornaam} ${postData.achternaam}, Bestand: ${postData.avatar} is gelogd.`;
      // HAAL ALLE BEZOEKERS OP UIT DB EN RENDER PAGINA BEZOEKERS
      const query = {}; // query leeg laten zodat alle documenten in de collectie worden geselecteerd
      const options = { sort: { naam: 1 } }; // sorteer op naam oplopend (aflopend is -1)
      const gelogdeBezoekers = await db
        .collection("bezoekers")
        .find(query, options)
        .toArray(); // maak array ipv default cursor terug te geven
      res.render("nieuwe-bezoeker", { bericht });
    } else {
      const errors = result.array();
      res.render("nieuwe-bezoeker", { errors });
    }
  }
);

// to do: bug fixen als gelogdeBezoekers leeg is.
app.get("/bezoekers", async (req, res) => {
  // If no formData in session, create empty array
  const formFilter = req.session.formFilter || [];
  // If no filter in array, query is empty to select all entries in database
  const query =
    formFilter.length === 0 ? {} : { specialisatie: { $in: formFilter } };
  const options = { sort: { naam: 1 } }; // sorteer op naam oplopend (aflopend is -1)
  const gelogdeBezoekers = await db
    .collection("bezoekers")
    .find(query, options)
    .toArray(); // maak array ipv default cursor terug te geven

  console.log("Bezoeker avatar link:", gelogdeBezoekers);
  res.render("bezoekers", { gelogdeBezoekers, formFilter });
});

app.post("/bezoekers", async (req, res) => {
  // Eén filter als string -> array, meerdere filters naar array, of lege array bij geen filters
  req.session.formFilter = req.body.filter ? [].concat(req.body.filter) : [];
  res.redirect("bezoekers");
});

app.get("/verwijder-alle", async (req, res) => {
  const verwijderAlle = await db.collection("bezoekers").deleteMany();
  // Redirect naar de pagina 'bezoeker' met form en overzichtsho
  const bericht = `Alle bezoekers zijn verwijderd`;
  res.render("bezoekers", { bericht, filterArray: [] });
});

// Login pagina tonen
app.get("/login", (req, res) => {
  const bericht =
    req.query.logout === "true" ? "Logged out. Session destroyed" : null;
  res.render("login", { bericht });
});

// Login verwerken
app.post("/login", loginSchema, async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const postData = req.body;
    // Zoek bezoeker in database op basis van e-mailadres
    const zoekBezoeker = await db
      .collection("bezoekers")
      .findOne({ email: postData.email });
    const bericht = `Bezoeker met e-mail ${zoekBezoeker.email} is gevonden.
                    De id van deze bezoeker is ${zoekBezoeker._id.toString()} 
                    en de hash van diens wachtwoord is: ${
                      zoekBezoeker.wachtwoord
                    }.`;

    // Vergelijk form wachtwoord met DB wachtwoord
    compareData(postData.wachtwoord, zoekBezoeker.wachtwoord)
      .then((match) => {
        // Als de wachtwoorden overeenkomen, ga naar account, anders naar login.
        if (match) {
          // Set a session variable to indicate that the user is logged in
          req.session.isLoggedIn = true;
          req.session.bezoeker = zoekBezoeker.email;

          res.redirect("account");
        } else {
          const bericht = `De opgegeven naam of wachtwoord is onjuist`;
          res.render("login", { bericht });
        }
      })
      .catch((error) => {
        console.log("Error bij afhandelen van wachtwoordverificatie:", error);
      });

    // if validation result is nog empty (when errors in validation)
  } else {
    const errors = result.array();
    res.render("login", { errors });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session: ", err);
    } else {
      const bericht = "Logged out. Session destroyed.";
      res.redirect("/login?logout=true");
    }
  });
});

app.get("/account", isLoggedIn, (req, res) => {
  bezoeker = req.session.bezoeker;
  res.render("account", { bezoeker });
});

// Home (view index met daarin query string)
app.get("/", (req, res) => {
  res.render("index");
});

// Gebruik de static map voor bestanden zonder route (css, afbeeldingen)
app.use(express.static("static"));

// Gebruik de upload map voor bestanden die door bezoekers worden geupload
app.use("/upload", express.static("upload"));

// 404 template
app.all("*", (req, res, next) => {
  res.status(404);
  res.render("404", { ErrorCode: 404 });
  res.send();
});
