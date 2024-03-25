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


app.post('/likeActors', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const personID = req.body.like_button; // Haal het ID van de persoon op uit het formulier
  
  try {
    // Update het document door het nieuwe item in de array te pushen
    const result = await users.updateOne(
      { _id: new ObjectId(user._id) },
      { $push: { likedActors: personID } } // Gebruik personID in plaats van likedActors
    );
    res.redirect('/profile-test'); // Na het toevoegen, redirect naar de trending pagina
    console.log("Acteur toegevoegd");
  } catch (error) {
    console.error('Fout bij het toevoegen van item:', error);
    res.status(500).send('Interne serverfout');
  }
});

app.post('/unlikeActors', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const personID = req.body.unlike_button; // Haal het ID van de persoon op uit het formulier
  
  try {
    // Update het document door het nieuwe item in de array te pushen
    const result = await users.updateOne(
      { _id: user._id }, // Specificeer het document op basis van de gebruiker
      { $pull: { likedActors: personID } } // Verwijder het specifieke element uit de array
    );
    res.redirect('/profile-test'); // Na het verwijderen, redirect naar de profielpagina
    console.log("Acteur verwijderd");
  } catch (error) {
    console.error('Fout bij het verwijderen van item:', error);
    res.status(500).send('Interne serverfout');
  }
});


app.post('/likeMovies', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const MovieID = req.body.like_button; // Haal het ID van de persoon op uit het formulier
  
  try {
    // Update het document door het nieuwe item in de array te pushen
    const result = await users.updateOne(
      { _id: new ObjectId(user._id) },
      { $push: { likedMovies: MovieID } } // Gebruik personID in plaats van likedActors
    );
    res.redirect('/profile-test'); // Na het toevoegen, redirect naar de trending pagina
    console.log("Movie toegevoegd");
  } catch (error) {
    console.error('Fout bij het toevoegen van item:', error);
    res.status(500).send('Interne serverfout');
  }
});


app.get('/actors', requireSession, async (req, res) => {
  let actorID = req.query.id;
  const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
  const person = await result.json();
  // console.log(Object.keys(person));
  res.render('pages/actors', { person });
});


app.get('/movieTest', requireSession, async (req, res) => {
  let movieID = req.query.id;
  const result = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
  const movie = await result.json();
  res.render('pages/movieTest', { movie });
});


app.get('/trending', async (req, res) => {
  const result = await fetch(`https://api.themoviedb.org/3/trending/person/day`, options);
  const trendingPersons = await result.json();
  const actorsData = trendingPersons.results.map(actor => ({
    name: actor.name,
    profilePath: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : null,
    id: actor.id
  }));

  const moviesResult = await fetch(`https://api.themoviedb.org/3/trending/movie/week`, options);
  const trendingMovies = await moviesResult.json();
  const moviesData = trendingMovies.results.map(movie => ({
    title: movie.title,
    posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
    id: movie.id,
    release: movie.release_date
  }));
  
  res.render('pages/trending', { actorsData, moviesData });
});


module.exports = app;