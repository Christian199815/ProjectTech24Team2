const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=CMD`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/login', (req, res) => {
    res.render('pages/signin');
})

app.post('/login', async (req, res) => {
    console.log(req.body);
    const database = client.db(`${process.env.DB_NAME}`);
    const collection = database.collection("general");
    const { username, password } = req.body;

    const user = await collection.findOne({ username });
    if (!user) {
        res.send('User not found');
        return;
    }
    if (!user.password) {
        res.send('Password field is missing in the database');
        return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
        res.send('Invalid password');
        return;
    }
    //start session here
    req.session.user = username;

    res.render('pages/home', { views: req.session.views, username: req.session.user });
    // res.send('Login successful!');
});

module.exports = app;