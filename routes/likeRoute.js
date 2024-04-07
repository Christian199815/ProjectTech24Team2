const express = require("express");
const router = express.Router();
const requireSession = require("../js-modules/reqSession.js");
const { client, ObjectId } = require("../js-modules/connect");
const options = require('../js-modules/tmdbOptions.js');


router.post("/likeMovies", requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user.username });
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
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedMovies: movieID } }
      );
    }
  } catch (error) {
    return res.render('pages/error', { error, user});
  }
});

router.post("/likeSeries", requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user.username });
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
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedSeries: serieID } }
      );
    }
  } catch (error) {
    return res.render('pages/error', { error, user});
  }
});

router.post("/likeActors", requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne({ username: req.session.user.username });
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
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedActors: personID } }
      );
    }
  } catch (error) {
    return res.render('pages/error', { error, user});
  }
});


module.exports = router;
