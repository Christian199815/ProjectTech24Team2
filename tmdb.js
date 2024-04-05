require('dotenv').config()

const express = require('express')
const app = express();
const session = require('express-session');
app.use(express.json());
const requireSession = require('./js-modules/reqSession');
const {client, ObjectId} = require('./js-modules/connect');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
  }
};



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




// app.post('/likeMovies', requireSession, async (req, res) => {
//   const database = client.db("Communities");
//   const users = database.collection("general");
//   const user = await users.findOne({ username: req.session.user });
//   const movieID = req.body.like_button;
  
//   try {
//     const alreadyLiked = user.likedMovies.includes(movieID);
    
//     if (alreadyLiked) {
//       console.log("Deze staat al in de lijst")
//     } else {
//       const result = await users.updateOne(
//         { _id: new ObjectId(user._id) },
//         { $push: { likedMovies: movieID } }
//       );
      
//     }
//   } catch (error) {
//     console.error('Fout bij het toevoegen van film:', error);
//     return res.status(500).send('Interne serverfout');
//   }
// });

app.post('/likeMovies', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const movieID = req.body.like_button;
  
  try {
    // Checken of likedMovies bestaat, zo niet, aanmaken
    if (!user.likedMovies) {
      await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { likedMovies: [] } }
      );
      // Opnieuw ophalen van de gebruiker na de update
      user.likedMovies = [];
    }

    const alreadyLiked = user.likedMovies.includes(movieID);
    
    if (alreadyLiked) {
      const result = await users.updateOne(
        { _id: user._id }, 
        { $pull: { likedMovies: movieID } }
      );
      console.log("film unliked")
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedMovies: movieID } }
      );
      console.log("film liked")
    }

  } catch (error) {
    console.error('Fout bij het toevoegen van film:', error);
    return res.status(500).send('Interne serverfout');
  }
});

app.post('/likeSeries', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const serieID = req.body.like_button;
  
  try {
    // Checken of likedSeries bestaat, zo niet, aanmaken
    if (!user.likedSeries) {
      await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { likedSeries: [] } }
      );
      // Opnieuw ophalen van de gebruiker na de update
      user.likedSeries = [];
    }

    const alreadyLiked = user.likedSeries.includes(serieID);
    
    if (alreadyLiked) {
      const result = await users.updateOne(
        { _id: user._id }, 
        { $pull: { likedSeries: serieID } }
      );
      console.log("serie unliked")
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedSeries: serieID } }
      );
      console.log("serie liked")
    }
  } catch (error) {
    console.error('Fout bij het toevoegen van serie:', error);
    return res.status(500).send('Interne serverfout');
  }
});

app.post('/likeActors', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user });
  const personID = req.body.like_button; 

  try {
    // Checken of likedSeries bestaat, zo niet, aanmaken
    if (!user.likedActors) {
      await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { likedActors: [] } }
      );
      // Opnieuw ophalen van de gebruiker na de update
      user.likedActors = [];
    }

    const alreadyLiked = user.likedActors.includes(personID);
    
    if (alreadyLiked) {
      const result = await users.updateOne(
        { _id: user._id }, 
        { $pull: { likedActors: personID } }
      );
      console.log("actor unliked")
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedActors: personID } }
      );
      console.log("actor liked")
    }
  } catch (error) {
    console.error('Fout bij het toevoegen van acteur:', error);
    return res.status(500).send('Interne serverfout');
  }
  res.redirect('back');
});








// app.post('/unlikeMovies', requireSession, async (req, res) => {
//   const database = client.db("Communities");
//   const users = database.collection("general");
//   const user = await users.findOne({ username: req.session.user });
//   const movieID = req.body.unlike_button; 
  
//   try {
//     const result = await users.updateOne(
//       { _id: user._id }, 
//       { $pull: { likedMovies: movieID } }
//     );
//     res.redirect('/profile-test');
//   } catch (error) {
//     console.error('Fout bij het verwijderen van item:', error);
//     res.status(500).send('Interne serverfout');
//   }
// });




// app.post('/unlikeSeries', requireSession, async (req, res) => {
//   const database = client.db("Communities");
//   const users = database.collection("general");
//   const user = await users.findOne({ username: req.session.user });
//   const serieID = req.body.unlike_button;
//   try {
//     const result = await users.updateOne(
//       { _id: user._id },
//       { $pull: { likedSeries: serieID } }
//     );
//     res.redirect('/profile-test');
//   } catch (error) {
//     console.error('Fout bij het verwijderen van item:', error);
//     res.status(500).send('Interne serverfout');
//   }
// });





// app.post('/unlikeActors', requireSession, async (req, res) => {
//   const database = client.db("Communities");
//   const users = database.collection("general");
//   const user = await users.findOne({ username: req.session.user });
//   const personID = req.body.unlike_button; 
  
//   try {
//     const result = await users.updateOne(
//       { _id: user._id },
//       { $pull: { likedActors: personID } }
//     );
//     res.redirect('/profile-test');
//   } catch (error) {
//     console.error('Fout bij het verwijderen van item:', error);
//     res.status(500).send('Interne serverfout');
//   }
// });


// app.get('/search', async (req, res) => {
//   let searchText = req.query.searchText;
//   const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchText}`, options);
//   const searchResult = await result.json();
//   res.render('pages/search', { searchResult });
// });

// app.get('/search', async (req, res) => {
//   let query = req.query.query || req.session.lastQuery || 'star wars';
//   req.session.lastQuery = query;

//   const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`, options);
//   const searchResult = await result.json();
  
//   res.render('pages/search', { searchResult });
// });


module.exports = app;