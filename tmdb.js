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

app.get('/serieTest', requireSession, async (req, res) => {
  let serieID = req.query.id;
  const result = await fetch(`https://api.themoviedb.org/3/tv/${serieID}`, options);
  const serie = await result.json();
  res.render('pages/serieTest', { serie });
});


app.get('/trending', async (req, res) => {
  const result = await fetch(`https://api.themoviedb.org/3/trending/person/week`, options);
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

  const seriesResult = await fetch(`https://api.themoviedb.org/3/trending/tv/week`, options);
  const trendingSeries = await seriesResult.json(); 
  const seriesData = trendingSeries.results.map(serie => ({ 
    name: serie.name,
    posterPath: serie.poster_path ? `https://image.tmdb.org/t/p/w200${serie.poster_path}` : null,
    id: serie.id,
  }));
  
  res.render('pages/trending', { actorsData, moviesData, seriesData }); 
});




app.post('/likeMovies', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const movieID = req.body.like_button;
  
  try {
    const alreadyLiked = user.likedMovies.includes(movieID);
    
    if (alreadyLiked) {
      console.log("Deze staat al in de lijst")
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedMovies: movieID } }
      );
      
    }
  } catch (error) {
    console.error('Fout bij het toevoegen van film:', error);
    return res.status(500).send('Interne serverfout');
  }
});


app.post('/unlikeMovies', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const movieID = req.body.unlike_button; 
  
  try {
    const result = await users.updateOne(
      { _id: user._id }, 
      { $pull: { likedMovies: movieID } }
    );
    res.redirect('/profile-test');
  } catch (error) {
    console.error('Fout bij het verwijderen van item:', error);
    res.status(500).send('Interne serverfout');
  }
});
















app.post('/likeSeries', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const serieID = req.body.like_button;
  
  try {
    const alreadyLiked = user.likedSeries.includes(serieID);
    
    if (alreadyLiked) {
      return res.redirect('/profile-test');
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedSeries: serieID } }
      );
      return res.redirect('/profile-test');
    }
  } catch (error) {
    console.error('Fout bij het toevoegen van serie:', error);
    return res.status(500).send('Interne serverfout');
  }
});


app.post('/unlikeSeries', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const serieID = req.body.unlike_button;
  try {
    const result = await users.updateOne(
      { _id: user._id },
      { $pull: { likedSeries: serieID } }
    );
    res.redirect('/profile-test');
  } catch (error) {
    console.error('Fout bij het verwijderen van item:', error);
    res.status(500).send('Interne serverfout');
  }
});


app.post('/likeActors', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const personID = req.body.like_button; 
  
  try {
    const alreadyLiked = user.likedActors.includes(personID);
    
    if (alreadyLiked) {
      return res.redirect('/profile-test');
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedActors: personID } }
      );
      return res.redirect('/profile-test');
    }
  } catch (error) {
    console.error('Fout bij het toevoegen van acteur:', error);
    return res.status(500).send('Interne serverfout');
  }
});


app.post('/unlikeActors', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const personID = req.body.unlike_button; 
  
  try {
    const result = await users.updateOne(
      { _id: user._id },
      { $pull: { likedActors: personID } }
    );
    res.redirect('/profile-test');
  } catch (error) {
    console.error('Fout bij het verwijderen van item:', error);
    res.status(500).send('Interne serverfout');
  }
});


app.get('/search', async (req, res) => {
  let searchText = req.query.searchText;
  const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchText}`, options);
  const searchResult = await result.json();
  res.render('pages/search', { searchResult });
});

app.get('/search', async (req, res) => {
  let query = req.query.query || req.session.lastQuery || 'star wars';
  req.session.lastQuery = query;

  const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`, options);
  const searchResult = await result.json();
  
  res.render('pages/search', { searchResult });
});


module.exports = app;