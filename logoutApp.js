const express = require('express');
const app = express();
const session = require('express-session');

app.get('/logout', (req, res) => {
    // Destroy session and redirect to login page
    req.session.destroy();
    res.redirect('/login');
  });

  module.exports = app;