const express = require("express");
const router = express.Router();
const {client} = require("../js-modules/connect");
const requireSession = require("../js-modules/reqSession.js");
const options = require('../js-modules/tmdbOptions.js');


router.get('/search', requireSession, async (req, res) => {
    const user = req.session.user;

    let searchText = req.query.searchText;
    const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchText}`, options);
    const searchResult = await result.json();
    res.render('pages/search', { searchResult, user });
  });

module.exports = router;