require('dotenv').config();

const xss = require('xss')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const userValidationRules = require('./userValidationRules');
const session = require('express-session');
const {client} = require('./connect');

const express = require('express');
const multer = require('multer'); //dont use in production
const port = process.env.PORT;
const app = express();

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true, limit: '50mb'}))




//load in the separate files
const loginApp = require('./routes/loginApp');
const logoutApp = require('./routes/logoutApp');

const signupApp = require('./routes/signupApp');
const preferencesApp = require('./routes/preferencesApp');
const photoApp = require('./routes/photoApp');


const homeApp = require('./routes/homeApp');
const tmdb = require('./tmdb');
const profile = require('./profile');
const actorApp = require('./routes/actorWThreadsApp');





app.use(session({
    secret: `${process.env.SESSIONKEY}`,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



app.set('view engine', 'ejs')

client.connect();

app.use(signupApp);
app.use(loginApp);
app.use(logoutApp);
app.use(homeApp);
app.use(preferencesApp);
app.use(photoApp);
app.use(tmdb);
app.use(profile);
app.use(actorApp);



app.listen(process.env.PORT, () => {
    console.log(`Movie Lounge API listening on port ${process.env.PORT}`)
})