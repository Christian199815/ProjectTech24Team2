const express = require('express');
const router = express.Router();
const requireSession = require("../reqSession");
const { client } = require('../connect');
const handleLikeUnlike = require("../handleLike");

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
    }
};


router.get('/actors', requireSession, async (req, res) => {
    let actorID = req.query.id;
    const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
    const person = await result.json();
    

    const birthDate = new Date(person.birthday);
    const ageDiffMilliseconds = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMilliseconds);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    

    // console.log(Object.keys(person));
    res.render('pages/actor-page', { person , age});


});

// Route for liking actors
router.post('/likeActors', requireSession, async (req, res) => {
    await handleLikeUnlike(req, res, 'likedActors', 'like');
});

// Route for unliking actors
router.post('/unlikeActors', requireSession, async (req, res) => {
    await handleLikeUnlike(req, res, 'likedActors', 'unlike');
});

module.exports = router;

