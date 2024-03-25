const express = require('express');
const session = require('express-session');
const requireSession = require('../reqSession.js');
const router = express.Router();




router.get('/home', requireSession, (req, res) => {
    // console.log(req.session.user)
    res.render('pages/home', { views: req.session.views, username: req.session.user });
})

console.log()

module.exports = router;