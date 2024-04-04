const express = require('express')
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const {client} = require('../connect');
const requireSession = require('../reqSession');
const multer = require('multer');
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');
const router = express.Router();


// Multer setup
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/upload/') 
  ,
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage});
// const upload = multer({ 
//   dest: path.join(__dirname, '../public/upload/') 
// });

router.use("/profile", express.static("upload"));

router.get('/profile',requireSession, async (req, res) => {
  res.render('pages/avatar');
})

router.post('/profile',requireSession, upload.single("profilePicture") , async (req, res) => {
  console.log('Hallo')
  console.log(req.body);
  console.log(req.file.filename);

  try {
    const db = client.db('Communities');

    // Assuming you have a 'users' collection
    const usersCollection = db.collection('general');

    // Update the user's profile picture in the database
    // await usersCollection.updateOne(
    //   { _id: ObjectId(req.session.user._id) },
    //   { $set: { profilePicture: req.file.filename } }
    // );

    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;

//amd syntax, import functies
