const express = require('express')
const router = express.Router();
const session = require('express-session');
const requireSession = require("../reqSession");
const { client, ObjectId } = require('../connect');

let user = null;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
  }
};

router.get('/serie-page', requireSession, async (req, res) => {
    user = req.session.user;
    let serieID = req.query.id;
    const result = await fetch(`https://api.themoviedb.org/3/tv/${serieID}`, options);
    const serie = await result.json();
    res.render('pages/serie-page', { serie, user });
  });

  module.exports = router;