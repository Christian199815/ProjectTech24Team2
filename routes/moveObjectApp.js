const express = require('express');
const session = require('express-session');
const router = express.Router();
const {client} = require('../connect');
const requireSession = require('../reqSession');


function moveObjects(username, desCollection, callback) {
    const db = client.db("Communities");
    const sourceCollection = db.collection('general');
    const destinationCollection = db.collection(`${desCollection}`);

    // Query documents to move from source collection
    sourceCollection.find({ username: username }).toArray((err, docs) => {
      if (err) {
        return callback(err);
      }

      // Insert documents into destination collection
      destinationCollection.insertMany(docs, (err, result) => {
        if (err) {
          return callback(err);
        }

      });
    });
  }

router.get('/move-object:desCollection', requireSession, (req, res) => {
    const username = req.session.user;
    const desCollection = req.params.desCollection;

    // Call the function to move objects
    moveObjects(username, desCollection, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      res.render('pages/home', { views: req.session.views, username: req.session.user });
    //   res.send(result);
    });
  });


  module.exports = router;