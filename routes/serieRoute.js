const express = require('express')
const router = express.Router();
const session = require('express-session');
const requireSession = require("../js-modules/reqSession.js");
const { client, ObjectId } = require('../js-modules/connect');
const options = require('../js-modules/tmdbOptions.js');

const threadDatabase = client.db(`${"Threads"}`);
const communityDatabase = client.db(`${"Communities"}`);

let sessionUser = null;
let currCollection = null;

let user = null;
let serie = null;
let posts = [];

async function fetchPosts(db) {
  try {
    const posts = await threadDatabase.collection(serie.name).find().toArray();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Unable to fetch posts');
  }
}

router.get('/serie-page', requireSession, async (req, res) => {
  sessionUser = req.session.user;
  user = sessionUser;
  let serieID = req.query.id;


  const result = await fetch(`https://api.themoviedb.org/3/tv/${serieID}`, options);
  serie = await result.json();


    const castResult = await fetch(`https://api.themoviedb.org/3/tv/${serieID}/credits`, options);
    cast = await castResult.json();

    const trailerResult = await fetch(`https://api.themoviedb.org/3/tv/${serieID}/videos`, options);
    trailer = await trailerResult.json();

    posts = await fetchPosts(threadDatabase);

    res.render('pages/serie-page', { serie, user, posts, cast, trailer });
  });


router.post('/post-serie-thread', async (req, res) => {

  const username = req.session.user.username;
  const profilePicture = req.session.user.profilePhoto;
  const { comment } = req.body;
  const currDateTime = new Date().toLocaleString();

  console.log(profilePicture);

  const collectionExists = await threadDatabase.listCollections({ name: serie.name }).hasNext();

  if (!collectionExists) {
    // If collection does not exist, create a new collection
    currCollection = await threadDatabase.createCollection(serie.name);
    console.log(`Collection '${serie.name}' created successfully`);
  } else {
    currCollection = threadDatabase.collection(serie.name);
    console.log(`Collection '${serie.name}' already exists`);
  }

  const newPost = {
    username: username,
    pf: profilePicture,
    body: comment,
    datetime: currDateTime,
    upvotes: 100,
    downvotes: 0,
  }

  const result = await currCollection.insertOne(newPost);
  console.log(`A document was inserted with the _id: ${result.insertedId}`);

  res.redirect('back');
})

router.get('/thread-reverse', async (req, res) => {
  posts = await posts.reverse();

  res.redirect('back');
})

router.post('/add-friend-seriePage', async (req, res) => {
  try {
    const friendReqUsername = req.body.postUsername;
    console.log(friendReqUsername);
    const users = communityDatabase.collection("general");

    const user = await users.findOne({ username: friendReqUsername });

    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    if (!user.friendRequests) {
      await users.updateOne(
        { _id: user._id },
        { $set: { friendRequests: [] } }
      );
      user.friendRequests = [];
    }
    if(user.friends){
    const alreadyFriends = user.friends.includes(sessionUser.username);
    }
    const alreadySent = user.friendRequests.includes(sessionUser.username);

    if (alreadySent || alreadyFriends) {
      console.log("Request already sent");
      // return res.status(400).send("Friend request already sent");
    } else {
      const result = await users.updateOne(
        { _id: user._id },
        { $push: { friendRequests: sessionUser.username } }
      );
      console.log("Friend request sent");
      // return res.status(200).send("Friend request sent successfully");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
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