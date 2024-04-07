const express = require('express')
const router = express.Router();
const session = require('express-session');
const requireSession = require("../js-modules/reqSession.js");
const { client, ObjectId } = require('../js-modules/connect');
const options = require('../js-modules/tmdbOptions.js');

const threadDatabase = client.db(`${"Threads"}`);
const communityDatabase = client.db(`${"Communities"}`);

let currCollection = null;
let sessionUser = null;
let alreadyFriends = null;

let user = null;
let serie = null;
let posts = [];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchPosts(db, res) {
  try {
    const posts = await threadDatabase.collection(serie.name).find().toArray();
    return posts;
  } catch (error) {
    return res.render('pages/error', { error, user });
  }
}

router.get('/serie-page', requireSession, async (req, res) => {
  sessionUser = req.session.user;
  user = sessionUser;
  let serieID = req.query.id;

  const result = await fetch(`https://api.themoviedb.org/3/tv/${serieID}`, options);
  const castResult = await fetch(`https://api.themoviedb.org/3/tv/${serieID}/credits`, options);
  const trailerResult = await fetch(`https://api.themoviedb.org/3/tv/${serieID}/videos`, options);

  serie = await result.json();
  cast = await castResult.json();
  trailer = await trailerResult.json();
  posts = await fetchPosts(threadDatabase, res );

  res.render('pages/serie-page', { serie, user, posts, cast, trailer });
});


router.post('/post-serie-thread', async (req, res) => {
  const username = req.session.user.username;
  const profilePicture = req.session.user.profilePhoto;
  const { comment } = req.body;
  const currDateTime = new Date().toLocaleString();
  const collectionExists = await threadDatabase.listCollections({ name: serie.name }).hasNext();

  if (!collectionExists) {
    currCollection = await threadDatabase.createCollection(serie.name);
  } else {
    currCollection = threadDatabase.collection(serie.name);
  }

  const newPost = {
    username: username,
    pf: profilePicture,
    body: comment,
    datetime: currDateTime,
    upvotes: getRandomInt(1, 100),
    downvotes: getRandomInt(1, 20),
  }
  const result = await currCollection.insertOne(newPost);
  
  res.redirect('back');
})

router.get('/thread-reverse', async (req, res) => {
  posts = await posts.reverse();

  res.redirect('back');
})

router.post('/add-friend-seriePage', async (req, res) => {
    try {
      const friendReqUsername = req.body.postUsername;
      const users = communityDatabase.collection("general");
      const buttonUser = await users.findOne({ username: friendReqUsername });
  
      if (!buttonUser) {
        return res.render('pages/error', { error: "User not found", user});
      }
      if (!buttonUser.friendRequests) {
          await users.updateOne(
              { _id: buttonUser._id },
              { $set: { friendRequests: [] } }
          );
          buttonUser.friendRequests = [];
      }
      if(buttonUser.friends){
      alreadyFriends = buttonUser.friends.includes(sessionUser.username);
      }
      const alreadySent = buttonUser.friendRequests.includes(sessionUser.username);
  
      if (alreadySent || alreadyFriends) {
          console.log("Request already sent");
      } else {
          const result = await users.updateOne(
              { _id: buttonUser._id },
              { $push: { friendRequests: sessionUser.username } }
          );
          console.log("Friend request sent");
      }
  } catch (error) {
      return res.render('pages/error', { error, user});
  }
      res.redirect('back');
})

router.post('/like-post', async (req, res) => {
  let upvoteAmount = req.body.curUpvotes;
  const postUser = req.body.postUsername;
  upvoteAmount = upvoteAmount + 1;
  if (currCollection) {
    const post = await currCollection.findOne({ username: postUser });
    const result = await currCollection.updateOne(
      { _id: post._id },
      { upvotes: upvoteAmount }
    );
  }
})

router.post('/dislike-post', async (req, res) => {
  let downvoteAmount = req.body.curDownvotes;

  const postUser = req.body.postUsername;
  downvoteAmount = downvoteAmount + 1;
  if (currCollection) {
    const post = await currCollection.findOne({ username: postUser });
    const result = await currCollection.updateOne(
      { _id: post._id },
      { upvotes: downvoteAmount }
    );
  }
})


module.exports = router;