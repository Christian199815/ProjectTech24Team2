const express = require('express');
const router = express.Router();
const requireSession = require("../js-modules/reqSession.js");
const { client, ObjectId } = require('../js-modules/connect');
const options = require('../js-modules/tmdbOptions.js');

const threadDatabase = client.db(`${"Threads"}`);
const communityDatabase = client.db(`${"Communities"}`);

let actorID = 0;
let movieCrew = null;
let person = null;
let posts = [];

let currCollection = null;
let user = null;
let sessionUser = null;
let alreadyFriends = null;


async function fetchPosts(db, res) {
    try {
        const posts = await threadDatabase.collection(person.name).find().toArray();
        return posts;
    } catch (error) {
      return res.render('pages/error', { error, user});
    }
  }



router.get('/actors', requireSession, async (req, res) => {
    sessionUser = req.session.user;
    user = sessionUser;
    actorID = req.query.id;

    const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
    const mCredits = await fetch(`https://api.themoviedb.org/3/person/${actorID}/combined_credits`, options);

    movieCrew = await mCredits.json();
    person = await result.json();
    posts = await fetchPosts(threadDatabase, res);

    let age;

  

    if(!person.deathday){
        const birthDate = new Date(person.birthday);
        const ageDiffMilliseconds = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiffMilliseconds);
        age = Math.abs(ageDate.getUTCFullYear() - 1970);
    } else {
        age = 'dead';
    }

    res.render('pages/actor-page', { person, age, posts, user, movieCrew });
});

router.post('/post-actor-thread', async (req, res) => {

    const username = req.session.user.username;
    const profilePicture = req.session.user.profilePhoto;
    const { comment } = req.body;
    const currDateTime = new Date().toLocaleString();
    const collectionExists = await threadDatabase.listCollections({ name: person.name }).hasNext();

    if (!collectionExists) {
        currCollection = await threadDatabase.createCollection(person.name);
    } else {
        currCollection = threadDatabase.collection(person.name);
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

    res.redirect('back');
})

router.get('/thread-reverse', async (req, res) => {
    posts = await posts.reverse();

    res.redirect('back');
})

router.post('/add-friend-actorPage', async (req, res) => {
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

