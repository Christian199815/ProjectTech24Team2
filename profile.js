require('dotenv').config()

const express = require('express')
const app = express();
const session = require('express-session');
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=CMD`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const requireSession = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login'); // Redirect to login page if session doesn't exist
  }
  next();
};



const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
  }
};

// app.get('/profile-test', requireSession, async (req, res) =>{
//   const database = client.db("Communities");
//   const users = database.collection("general");
//   const user = await users.findOne({ username: req.session.user });

//   const fetchedActors = await Promise.all(likedActors.map(async (actorID) => {
//     const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
//     return result.json();
//   }));
//   res.render('pages/profile-test', { username: req.session.user, likedActors: fetchedActors, likedMovies: fetchedMovies});
// });


// app.get('/profile-test', requireSession,async (req, res) => {
//   const database = client.db("Communities");
//   const users = database.collection("general");
//   const user = await users.findOne({ username: req.session.user });
//   console.log(likedMovies);

//   const fetchedMovies = await Promise.all(likedMovies.map(async (movieID) => {
//     const result = await  fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
//     return result.json();
// }));
// res.render('pages/profile-test', { likedMovies: fetchedMovies });
// });

app.get('/profile-test', requireSession, async (req, res) => {
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

    res.render('pages/profile-test', { 
      username: req.session.user, 
      likedActors: fetchedActors, 
      likedMovies: fetchedMovies 
    });
  } catch (error) {
    console.error('Er is een fout opgetreden bij het ophalen van gegevens:', error);
    res.status(500).send('Interne serverfout');
  }
});


  
  
  module.exports = app;