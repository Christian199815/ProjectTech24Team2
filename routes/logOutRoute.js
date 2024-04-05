const express = require('express');
const session = require('express-session');
const router = express.Router();

router.get('/logout', (req, res) => {
    // Destroy session and redirect to login page
    req.session.destroy();
    res.redirect('/login');
  });

  module.exports = router;