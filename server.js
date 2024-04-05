const session = require('express-session');
const express = require('express');
const port = process.env.PORT;
const app = express();
const {client} = require('./js-modules/connect');

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true, limit: '50mb'}))

//load in the separate files
const logInRoute = require('./routes/logInRoute');
const logOutRoute = require('./routes/logOutRoute');
const signUpRoute = require('./routes/signUpRoute');


const preferencesRoute = require('./routes/preferencesRoute');
const errorRoute = require('./routes/errorRoute');
const searchRoute = require('./routes/searchRoute');


const homeRoute = require('./routes/homeRoute');
const profileRoute = require('./routes/profileRoute');
const likeApp = require('./routes/likeRoute');

const movieRoute = require('./routes/movieRoute');
const serieRoute = require('./routes/serieRoute');
const actorRoute = require('./routes/actorRoute');

app.use(session({
    secret: `${process.env.SESSIONKEY}`,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs')

client.connect();

app.use(signUpRoute);
app.use(logInRoute);
app.use(logOutRoute);
app.use(homeRoute);
app.use(preferencesRoute);
app.use(profileRoute);

app.use(errorRoute);
app.use(likeApp);
app.use(searchRoute);

app.use(movieRoute);
app.use(serieRoute);
app.use(actorRoute);



app.listen(process.env.PORT, () => {
    console.log(`Movie Lounge API listening on port ${process.env.PORT}`)
})