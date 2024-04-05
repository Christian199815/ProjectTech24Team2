const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const {client} = require('../js-modules/connect');
const userValidationRules = require('../js-modules/userValidationRules');
const session = require('express-session');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log(errors)
        return next();
    }
    const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
    res.locals.errors = extractedErrors;
    res.render('pages/signup', { errors: res.locals.errors })
    next();
};


const pfImages = [
    '/images/profile-photos/profilepicture1.png',
    '/images/profile-photos/profilepicture2.png',
    '/images/profile-photos/profilepicture3.png',
    '/images/profile-photos/profilepicture4.png',
    '/images/profile-photos/profilepicture5.png',
    '/images/profile-photos/profilepicture6.png',
    '/images/profile-photos/profilepicture7.png',
    '/images/profile-photos/profilepicture8.png',
];



function getRandomImg(){
    const randomIndex = Math.floor(Math.random() * pfImages.length);
    return pfImages[randomIndex];
}



router.get('/signup', async (req, res) => {
    res.render('pages/signup', { errors: [], user: req.session.user })
})

router.post('/signup',validate, userValidationRules, async (req, res) => {
    const database = client.db("Communities");
    const users = database.collection("general");

    const { username, email, password, DateOfBirth } = req.body;

    console.log(typeof(DateOfBirth));

    const birthDate = new Date(DateOfBirth);
  
    const ageDiffMilliseconds = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMilliseconds);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const newUser = {
        username: username,
        email: email,
        password: await bcrypt.hash(password, 10),
        isAdult: age >= 18 ? true : false,
        profilePhoto: getRandomImg()
    }
    const result = await users.insertOne(newUser);
})

module.exports = router;