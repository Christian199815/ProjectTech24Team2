require('dotenv').config()

const express = require('express')
const app = express()

let actorID = 1190668;
let actorID2 = 1;
let movieID = 693134;
let movieID2 = 1011985;


const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
    }
  };
  
  app.get('actors', async (req, res) => {
    const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
    const person = await result.json();
    console.log(Object.keys(person));
    res.render('pages/actors', { person });

  })
  

  module.exports = app;