require('dotenv').config();

const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId, CommandStartedEvent } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=CMD`;
const port = process.env.PORT;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')


// let conn;

// async function run(){
//     try {
//         conn = await client.connect();
//       } catch(e) {
//         console.error(e);
//       }
// }

// run();

// let db = conn.db("Communicties");


app.use(express.json({ type: "*/*" }));

app.get('/signup', async(req, res) => {
    // res.render('pages/form')

})



// app.post('/signup', async (req, res) => {

// })



//    filmData.push( { 
//         title: req.body.title,
//         story: req.body.story
//     });



app.listen(process.env.PORT, () => {
    console.log(`Project Tech Data API listening on port ${process.env.PORT}`)
})