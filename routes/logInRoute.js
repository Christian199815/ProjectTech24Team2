const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { client } = require('../js-modules/connect')



router.get('/login', (req, res) => {
    const user = req.session.user;
    // res.render('pages/actor-page-ThreadsTest', { person, age, posts, user });
    res.render('pages/signin', {user});
})

router.post('/login', async (req, res) => {
    const database = client.db(`${"Communities"}`);
    const collection = database.collection("general");
    const { email, password, remember } = req.body;

    const user = await collection.findOne({ email });
    if (!user) {
        res.send('User not found');
        return;
    }
    if (!user.password) {
        // res.status(500).render('error', { error: "Password field is missing in the database" });
        res.send('Password field is missing in the database');
        return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
        // res.status(500).render('error', { error: "Invalid password" });
        res.send('invalid pwwrd');

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


