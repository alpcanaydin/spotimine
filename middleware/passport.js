'use strict';

const SpotifyStrategy = require('passport-spotify').Strategy;
const config = require('../lib/config');
const User = require('../model/user');
const spotifyMapper = require('../lib/mapper/spotify');

module.exports = {
  serializeUser: (user, done) => {
    done(null, user.id);
  },

  deserializeUser: (id, done) => {
    User
      .findById(id)
      .then(user => done(null, user))
      .catch(err => done(err, null))
    ;
  },

  spotifyStrategy: new SpotifyStrategy({
    clientID: config.spotify.id,
    clientSecret: config.spotify.secret,
    callbackURL: config.spotify.callback,
    scope: config.spotify.scope
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      const rawData = profile._json;
      rawData.accessToken = accessToken;
      rawData.refreshToken = refreshToken;
      const data = spotifyMapper(rawData);

      User
        .upsertBySpotify(data)
        .then(user => user.upsertArtists())
        .then(user => user.upsertTracks())
        .then(user => done(null, user))
        .catch(err => {
          console.log(`Error on spotify login: ${err}`);
          done(err, false);
        })
      ;
    });
  })
};
