const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');
const cookieParser = require('cookie-parser');
const router = express.Router();
const { client } = require('../connect')



router.get('/login', (req, res) => {
    res.render('pages/signin', { user: req.session.user });
})

router.post('/login', async (req, res) => {
    const database = client.db(`${"Communities"}`);
    const collection = database.collection("general");
    const { username, password, remember } = req.body;

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
    req.session.user = user;

    if (remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        console.log('long cookie');
    } else {
        req.session.cookie.maxAge = 30 * 60 * 1000;
        console.log('short cookie');

    }
   res.redirect('/home');
});

module.exports = router;