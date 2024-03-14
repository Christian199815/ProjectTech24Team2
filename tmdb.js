require('dotenv').config()

const express = require('express')
const app = express();
const session = require('express-session');
app.use(express.json());

// let actorID = 1190668;
let actorID = 234352;
let directorID = 1;

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

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_TOKEN}` // Vervang <JOUW_AUTH_TOKEN> door je eigen bearer token
  }
};

app.get('/actors', requireSession, async (req, res) => {
  const result = await fetch(`https://api.themoviedb.org/3/person/${actorID}`, options);
  const person = await result.json();
  // console.log(Object.keys(person));
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne( {username: req.session.user});
  console.log(user);
  res.render('pages/actors', { person });

})

// app.patch('/actors', requireSession, async (req, res) => {
//   const database = client.db("Communities");
//   const users = database.collection("general");
//   const user = await users.findOne( {username: req.session.user});
//   const personID = user._id;

//   const likedActor = actorID;

// try {

//   const result = await users.updateOne(
//     {_id: ObjectId(personID)},
//     {$push: {likedActors: likedActor}}
//   );
// if (result.modifiedCount === 1) {
//   res.status(200).send("Actor liked");
// } else {
//   res.status(404).send("document not found")
// }


// } catch (error) {
//   console.error("ERROR PUSHING ITEM ACTOR:", error);
//   res.status(500).send("Internal server error");
// }

//   //persoon -> ID -> sessie
//   //ID van de acteur opslaan in de array van de persoon -> let actorID
//   //welke DB -> welke collectie


// });


app.patch('/actors', requireSession, async (req, res) => {
  const database = client.db("Communities");
  const users = database.collection("general");
  const user = await users.findOne( {username: req.session.user});
  const personID = user._id;
  let likedActor = actorID;

  try {
    // Update the document by pushing the new item into the array
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(personID) },
      { $push: {likedActors: likedActor } }
    );

    console.log('Update result:', result);

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      res.status(200).send('Item pushed successfully');
    } else {
      res.status(404).send('Document not found');
    }
  } catch (error) {
    console.error('Error pushing item:', error);
    res.status(500).send('Internal Server Error');
  }
});






module.exports = app;