const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');
const cookieParser = require('cookie-parser');
const router = express.Router();
const { client } = require('../connect')



router.get('/login', (err, req, res) => {
    const user = req.session.user;


    res.render('pages/signin');
})

router.post('/login', async (req, res) => {
    const database = client.db(`${"Communities"}`);
    const collection = database.collection("general");
    const { username, password, remember } = req.body;

    const user = await collection.findOne({ username });
    if (!user) {
        res.status(500).render('error', { error: "User not found" });
        // res.send('User not found');
        return;
    }
    if (!user.password) {
        res.status(500).render('error', { error: "Password field is missing in the database" });
        // res.send('Password field is missing in the database');
        return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(500).render('error', { error: "Invalid password" });
        return;
    }
    //start session here
    req.session.user = user;

    if (remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        console.log('long cookie');
    } else {
        req.session.cookie.maxAge = 30 * 60 * 1000;
        console.log('short cookie');

    }
    // const returnTo = req.session.returnTo || '/';
    // delete req.session.returnTo;
    // res.redirect(returnTo);

    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo; // Remove stored returnTo URL
    res.redirect(returnTo);

    // res.render('pages/home', { views: req.session.views, user: req.session.user });
});

module.exports = router;


