const express = require('express');
const session = require('express-session');

const requireSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Redirect to login page if session doesn't exist
    }
    next();
};


module.exports = requireSession;