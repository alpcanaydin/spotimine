'use strict';

const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./lib/config');
const passport = require('passport');
const passportMiddleware = require('./middleware/passport');
const routes = require('./routes');

// Mongoose Connection
const mongodb = config.mongodb;
mongoose.connect(`${mongodb.host}:${mongodb.port}/${mongodb.db}`);

// Express Configuration
const app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    domain: config.session.domain
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Passport Configuration
passport.serializeUser(passportMiddleware.serializeUser);
passport.deserializeUser(passportMiddleware.deserializeUser);
passport.use(passportMiddleware.spotifyStrategy);
app.use(passport.initialize());
app.use(passport.session());

// Routes
routes(app, { passport });

// Run application
const PORT = 3000;
app.listen(process.env.API_PORT || PORT, () => {
  console.log('Spotify app is running.');
});
