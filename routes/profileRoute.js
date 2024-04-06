require('dotenv').config()

const express = require('express')
const router = express.Router();
const session = require('express-session');

const { client, ObjectId } = require('../js-modules/connect');
const requireSession = require('../js-modules/reqSession');
const options = require('../js-modules/tmdbOptions');
const database = client.db("Communities");
const users = database.collection("general");

let fetchedActors = null;
let fetchedMovies = null;
let fetchedSeries = null;
let fetchedFRequests = null;
let fetchedFriends = null;
let user = null;





router.get('/profile', requireSession, async (req, res) => {
  
  const user = await users.findOne({ email: req.session.user.email });

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
      const usernamesToCheck = user.friendRequests;
      fetchedFRequests = allUsers.filter(obj => usernamesToCheck.includes(obj.username));
      console.log(fetchedFRequests);
    }

    if (user.friends) {
      const allUsers = await users.find().toArray();
      const usernamesToCheck = user.friends;
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
    return res.render('pages/error', { error, user});
  }
});

router.post('/remove-fRequest', async (req, res) => {
  const user = await users.findOne({ username: req.session.user.username });
  let valueToRemove = req.body.removeName;
  const result = await gebruikers.updateOne(
    { _id: user._id },
    { $pull: { friendRequests: valueToRemove } } 
  );
  res.redirect('back');
});

router.post('/accept-fRequest', async (req, res) => {
  const user = await users.findOne({ username: req.session.user.username });
  let value = req.body.addName;
  const pushResult = await users.updateOne(
    { _id: user._id }, 
    { $push: { friends: value } } 
  );
  const pullResult = await users.updateOne(
    { _id: user._id }, 
    { $pull: { friendRequests: value } } 
  );
  res.redirect('back');
})


module.exports = router;