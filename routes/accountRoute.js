require('dotenv').config()

const express = require('express')
const router = express.Router();
const session = require('express-session');
const {client, ObjectID} = require('../js-modules/connect');
const requireSession = require('../js-modules/reqSession');
const options = require('../js-modules/tmdbOptions');

let fetchedActors = null;
let fetchedMovies = null;
let fetchedSeries = null;

router.get('/profile-test', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });

  try {
    if (user.likedActors){
      fetchedActors = await Promise.all(user.likedActors.map(async (actorID) => {
      const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
      return result.json();
    }));}

    if (user.likedMovies){
    fetchedMovies = await Promise.all(user.likedMovies.map(async (movieID) => {
      const result = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
      return result.json();
    }));}

    if (user.likedSeries){
    fetchedSeries = await Promise.all(user.likedSeries.map(async (serieID) => {
      const result = await fetch(`https://api.themoviedb.org/3/tv/${serieID}`, options);
      return result.json();
    }));}

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