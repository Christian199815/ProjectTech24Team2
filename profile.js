require('dotenv').config()

const express = require('express')
const router = express.Router();
const session = require('express-session');
const {client} = require('./connect');
const requireSession = require('./reqSession');




const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
  }
};

router.get('/profile-test', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });

  try {
    const fetchedActors = await Promise.all(user.likedActors.map(async (actorID) => {
      const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
      return result.json();
    }));

    const fetchedMovies = await Promise.all(user.likedMovies.map(async (movieID) => {
      const result = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
      return result.json();
    }));


    const fetchedSeries = await Promise.all(user.likedSeries.map(async (serieID) => {
      const result = await fetch(`https://api.themoviedb.org/3/tv/${serieID}`, options);
      return result.json();
    }));

    res.render('pages/profile-test', { 
      username: req.session.user, 
      likedActors: fetchedActors, 
      likedMovies: fetchedMovies, 
      likedSeries: fetchedSeries

    });
  } catch (error) {
    console.error('Er is een fout opgetreden bij het ophalen van gegevens:', error);
    res.status(500).send('Interne serverfout');
  }
});


  
  
  module.exports = router;