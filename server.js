require('dotenv').config();

const xss = require('xss')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const userValidationRules = require('./userValidationRules');
const session = require('express-session');

//load in the separate files
const loginApp = require('./routes/loginApp');
const signupApp = require('./routes/signupApp');
const logoutApp = require('./routes/logoutApp');
const homeApp = require('./routes/homeApp');
const moveObjectApp = require('./routes/moveObjectApp');

const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');
const multer = require('multer'); //dont use in production
const upload = multer({ dest: 'public/upload/' }) //bestanden eigenlijk naar een CDN 

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

app.use(session({
    secret: `${process.env.SESSIONKEY}`,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ type: "*/*" }));

app.set('view engine', 'ejs')

client.connect();

const requireSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Redirect to login page if session doesn't exist
    }
    next();
};

app.use(signupApp);
app.use(loginApp);
app.use(logoutApp);
app.use(homeApp);
app.use(moveObjectApp);

app.listen(process.env.PORT, () => {
    // console.log(`${process.env.PORT}`);
    console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})