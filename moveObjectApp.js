const express = require('express');
const app = express();
const session = require('express-session');

const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=CMD`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const requireSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Redirect to login page if session doesn't exist
    }
    next();
};

function moveObjects(username, desCollection, callback) {
    const db = client.db("Communities");
    const sourceCollection = db.collection('general');
    const destinationCollection = db.collection('desCollection');

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

        // Optionally, remove documents from source collection
        // sourceCollection.deleteMany({ username: username }, (err, result) => {
        //   if (err) {
        //     return callback(err);
        //   }

        //   callback(null, 'Objects moved successfully');
        // });
      });
    });
  }

app.get('/move-object:desCollection', requireSession, (req, res) => {
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


  module.exports = app;