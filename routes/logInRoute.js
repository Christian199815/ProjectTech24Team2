const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { client } = require('../js-modules/connect')



router.get('/login', (req, res) => {
    const user = req.session.user;
    res.render('pages/signin', {errors: "none",user});
})

router.post('/login', async (req, res) => {
    const database = client.db(`${"Communities"}`);
    const collection = database.collection("general");
    const { email, password, remember } = req.body;

    const user = await collection.findOne({ email });
    if (!user) {
        res.render('pages/signin', { errors: 'User not found', user: req.session.user })
        return;
    }
    if (!user.password) {
        res.render('pages/signin', { errors: 'Password field is missing in the database', user: req.session.user })
        return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
        res.render('pages/signin', { errors: 'Invalid password', user: req.session.user })
        return;
    }
    //start session here
    req.session.user = user;

    if (remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
        req.session.cookie.maxAge = 30 * 60 * 1000;
    }
    res.redirect('/home');
});

module.exports = router;


