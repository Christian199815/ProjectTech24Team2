const express = require('express');
const app = express();
const session = require('express-session');

const requireSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Redirect to login page if session doesn't exist
    }
    next();
};

app.get('/finishPrefs', requireSession, (req, res) => {
    res.render('pages/home', { views: req.session.views, username: req.session.user });
})


module.exports = app;