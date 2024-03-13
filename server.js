require('dotenv').config();

const xss = require('xss')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const userValidationRules = require('./userValidationRules'); 

const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');
const multer = require('multer'); //dont use in production
const upload = multer({dest: 'public/upload/'}) //bestanden eigenlijk naar een CDN 
// require('express-session');


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: `${process.env.MAILUSER}`,
//         pass: `${process.env.MAILPSSWRD}`
//     }
// });




const app = express();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=CMD`;
const port = process.env.PORT;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log(errors)
      return next();
    }
    const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
    res.locals.errors = extractedErrors;
    res.render('pages/form', { errors: res.locals.errors })
    next();
  };



app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.set('view engine', 'ejs')

client.connect();


// let db = conn.db("Communicties");
app.use(express.json({ type: "*/*" }));

app.get('/signup', async (req, res) => {
    res.render('pages/form', { errors: [] })

})

app.post('/signup', userValidationRules, validate, async (req, res) => {
    const database = client.db(`${process.env.DB_NAME}`);
    const users = database.collection("general");

    const { username, email, password } = req.body;

    // Create a document to insert
    const newUser = {
        username: username,
        email: email,
        password: await bcrypt.hash(password, 10),
    }

    // let mailOptions = {
    //     from: `${process.env.MAILADRESS}`,
    //     to: req.body.email,
    //     subject: 'Welcome to the Movie Lounge Family',
    //     text: 'Nice to welcome you!'
    
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    //     if(error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });

    // Insert the defined document into the "haiku" collection
    const result = await users.insertOne(newUser);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    
    res.render('pages/login');
   
})

app.get('/login', (req, res) => {
    res.render('pages/signin');
})

app.post('/login', async (req, res) => {
    console.log(req.body);
    const database = client.db(`${process.env.DB_NAME}`);
    const collection = database.collection("general");
    const { username, password } = req.body;

    console.log(username);
    console.log(password);

    // Find user in the database
    const user = await collection.findOne({ username });
    // console.log(user);

    // If user not found
    if (!user) {
        res.send('User not found');
        return;
    }

    // If user found but password field is missing
    if (!user.password) {
        res.send('Password field is missing in the database');
        return;
    }
    if (!(await bcrypt.compare(password, user.password))) { 
        res.send('Invalid password');
        return;
    }
    //start session here

    res.send('Login successful!');
});








app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT}`);
    console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})