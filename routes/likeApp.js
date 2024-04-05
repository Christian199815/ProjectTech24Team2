require("dotenv").config();

const express = require("express");
const router = express.Router();
const requireSession = require("../reqSession");
const { client, ObjectId } = require("../connect");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  },
};

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
      console.log("film unliked");
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedMovies: movieID } }
      );
      console.log("film liked");
    }
  } catch (error) {
    console.error("Fout bij het toevoegen van film:", error);
    return res.status(500).send("Interne serverfout");
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
      console.log("serie unliked");
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedSeries: serieID } }
      );
      console.log("serie liked");
    }
  } catch (error) {
    console.error("Fout bij het toevoegen van serie:", error);
    return res.status(500).send("Interne serverfout");
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
      console.log("actor unliked");
    } else {
      const result = await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { likedActors: personID } }
      );
      console.log("actor liked");
    }
  } catch (error) {
    console.error("Fout bij het toevoegen van acteur:", error);
    return res.status(500).send("Interne serverfout");
  }
});

router.get("/home", async (req, res) => {
  console.log("tom is een plopkoek")

  const everything = await fetch(`https://api.themoviedb.org/3/discover/movie`, options);
  const searchResult = await everything.json();
  console.log(searchResult);
  
  let fetchedMovies = await Promise.all(user.likedMovies.map(async (movieID) => {
  const result = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
  return result.json();
  }));
});










module.exports = router;
