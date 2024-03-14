const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=CMD`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const userValidationRules = require('./userValidationRules');
const session = require('express-session');

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


app.get('/signup', async (req, res) => {
    res.render('pages/form', { errors: [] })
})

app.post('/signup', userValidationRules, validate, async (req, res) => {
    const database = client.db("Communities");
    const users = database.collection("general");

    const { username, email, password } = req.body;

    // Create a document to insert
    const newUser = {
        username: username,
        email: email,
        password: await bcrypt.hash(password, 10),
    }

    // Insert the defined document into the "haiku" collection
    const result = await users.insertOne(newUser);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    req.session.user = username;

    res.render('pages/home', { views: req.session.views, username: req.session.user });

    // res.render('pages/login');

})

module.exports = app;