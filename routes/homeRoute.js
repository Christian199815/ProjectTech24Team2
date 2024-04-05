const express = require("express");
const router = express.Router();
const { client } = require("../js-modules/connect");
const requireSession = require("../js-modules/reqSession");
const options = require('../js-modules/tmdbOptions');


const database = client.db('Communities');
const collection = database.collection('general');

let movieAlreadyLiked = null;





router.get('/home', requireSession, async (req, res) => {

  const user = req.session.user;

  const result = await fetch(`https://api.themoviedb.org/3/trending/person/week`, options);
  const trendingPersons = await result.json();
  const actorsData = trendingPersons.results.map(actor => ({
    name: actor.name,
    profilePath: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : null,
    id: actor.id
  }));

  const moviesResult = await fetch(`https://api.themoviedb.org/3/trending/movie/day`, options);
  const trendingMovies = await moviesResult.json();
  const moviesData = trendingMovies.results.map(movie => ({
    title: movie.title,
    posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
    posterBackdrop: movie.backdrop_path ? `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}` : null,
    id: movie.id,
    overview: movie.overview
  }));

  const seriesResult = await fetch(`https://api.themoviedb.org/3/trending/tv/day`, options);
  const trendingSeries = await seriesResult.json();
  const seriesData = trendingSeries.results.map(serie => ({
    name: serie.name,
    posterPath: serie.poster_path ? `https://image.tmdb.org/t/p/w200${serie.poster_path}` : null,
    posterBackdrop: serie.backdrop_path ? `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${serie.backdrop_path}` : null,
    id: serie.id,
  }));

  const npMoviesResult = await fetch(`https://api.themoviedb.org/3/movie/top_rated`, options);
  const nowPlayingMovies = await npMoviesResult.json();
  const npMoviesData = nowPlayingMovies.results.map(npMovie => ({
    title: npMovie.title,
    posterPath: npMovie.poster_path ? `https://image.tmdb.org/t/p/w200${npMovie.poster_path}` : null,
    posterBackdrop: npMovie.backdrop_path ? `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${npMovie.backdrop_path}` : null,
    id: npMovie.id,
    overview: npMovie.overview,
  }));


  res.render('pages/homepage', { actorsData, moviesData, seriesData, npMoviesData, movieAlreadyLiked, user });
});

router.get('/search', requireSession, async (req, res) => {
  let searchText = req.query.searchText;
  const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchText}`, options);
  const searchResult = await result.json();
  res.render('pages/search', { searchResult });
});

router.get('/search', requireSession, async (req, res) => {
  let query = req.query.query || req.session.lastQuery || 'star wars';
  req.session.lastQuery = query;

  const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`, options);
  const searchResult = await result.json();

  res.render('pages/search', { searchResult });
});


module.exports = router;