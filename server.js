require('dotenv').config();
const xss = require('xss')


const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=CMD`;
const port = process.env.PORT;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

client.connect();
// async function DBConnect() {
//     try {
//       // Connect to the "insertDB" database and access its "haiku" collection

//     } finally {
//        // Close the MongoDB client connection
//       await client.close();
//     }
//   }
//   // Run the function and handle any errors
//   run().catch(console.dir);


// let db = conn.db("Communicties");


app.use(express.json({ type: "*/*" }));

app.get('/signup', async (req, res) => {
    res.render('pages/form')

})

app.post('/signup', async (req, res) => {
    const database = client.db(`${process.env.DB_NAME}`);
    const users = database.collection("general");

    // Create a document to insert
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        pw: req.body.password,
    }
    // Insert the defined document into the "haiku" collection
    const result = await users.insertOne(newUser);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    res.render('pages/home', { name: req.body.username })
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/login', async (req, res) => {
    let result = await client.connect();
    let db = result.db(`${process.env.DB_NAME}`);


    const query = {}; // leeg laten om alle documenten op te halen
    const options = { sort: { naam: 1 } }; // sorteer op naam oplopend (aflopend is -1)
    const gelogdeBezoekers = await db
        .collection("general")
        .find(query, options)
        .toArray(); // maak array ipv default cursor terug te geven
   

        const usernames = gelogdeBezoekers.map(bezoeker => bezoeker.username);

    
    let reqUsername = req.body.username;
    let reqPassword = req.body.password;

    if(reqUsername === gelogdeBezoekers)
   
   
   
   
   
        res.render("pages/home", { bezoekers: gelogdeBezoekers, name: 'hans' });



})


app.listen(process.env.PORT, () => {
    console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})