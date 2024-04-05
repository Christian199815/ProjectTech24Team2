const express = require('express');
const app = express();
const session = require('express-session');
const router = express.Router();
const requireSession = require("../js-modules/reqSession");


router.get('/finishPrefs', requireSession, (req, res) => {
    res.redirect('/login');
})


module.exports = router;