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

router.get('/movie-page', requireSession, async (req, res) => {
    user = req.session.user;
    let movieID = req.query.id;
    const result = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
    const movie = await result.json();
    res.render('pages/movie-page', { movie, user });
  });

  module.exports = router;