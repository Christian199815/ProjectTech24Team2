require('dotenv').config()

const express = require('express')
const router = express.Router();
const session = require('express-session');

const { client, ObjectId } = require('../connect');
const requireSession = require('../reqSession');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
  }
};

let fetchedActors = null;
let fetchedMovies = null;
let fetchedSeries = null;
let fetchedFRequests = null;
let fetchedFriends = null;


let user = null;
const database = client.db("Communities");
const users = database.collection("general");



router.get('/profile-test', requireSession, async (req, res) => {
  
  const user = await users.findOne({ username: req.session.user.username });

  try {
    if (user.likedActors) {
      fetchedActors = await Promise.all(user.likedActors.map(async (actorID) => {
        const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
        return result.json();
      }));
    }

    if (user.likedMovies) {
      fetchedMovies = await Promise.all(user.likedMovies.map(async (movieID) => {
        const result = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
        return result.json();
      }));
    }

    if (user.likedSeries) {
      fetchedSeries = await Promise.all(user.likedSeries.map(async (serieID) => {
        const result = await fetch(`https://api.themoviedb.org/3/tv/${serieID}`, options);
        return result.json();
      }));
    }

    if (user.friendRequests) {
      const allUsers = await users.find().toArray();

      // Array of usernames to check
      const usernamesToCheck = user.friendRequests;
      // Array to store matching objects
      fetchedFRequests = allUsers.filter(obj => usernamesToCheck.includes(obj.username));
      console.log(fetchedFRequests);

    }

    if (user.friends) {
      const allUsers = await users.find().toArray();

      // Array of usernames to check
      const usernamesToCheck = user.friends;
      // Array to store matching objects
      fetchedFriends = allUsers.filter(obj => usernamesToCheck.includes(obj.username));
    }
    res.render('pages/profile', {
      username: req.session.user,
      likedActors: fetchedActors,
      likedMovies: fetchedMovies,
      likedSeries: fetchedSeries,
      friendRequests: fetchedFRequests,
      friends: fetchedFriends,
      user,
    });
  } catch (error) {
    console.error('Er is een fout opgetreden bij het ophalen van gegevens:', error);
    res.status(500).send('Interne serverfout');
  }
});

router.post('/remove-fRequest', async (req, res) => {

  const user = await users.findOne({ username: req.session.user.username });

  let valueToRemove = req.body.removeName;
  // Using updateOne to remove the value from the array in MongoDB
  const result = await gebruikers.updateOne(
    { _id: user._id }, // Assuming user object has _id field
    { $pull: { friendRequests: valueToRemove } } // Removing the specified value from friendRequests array
  );
 
  res.redirect('back');
});

router.post('/accept-fRequest', async (req, res) => {
  
  const user = await users.findOne({ username: req.session.user.username });

  let value = req.body.addName;

  const pushResult = await users.updateOne(
    { _id: user._id }, // Assuming user object has _id field
    { $push: { friends: value } } // Removing the specified value from friendRequests array
  );


  // Using updateOne to remove the value from the array in MongoDB
  const pullResult = await users.updateOne(
    { _id: user._id }, // Assuming user object has _id field
    { $pull: { friendRequests: value } } // Removing the specified value from friendRequests array
  );
 
  res.redirect('back');

})


module.exports = router;