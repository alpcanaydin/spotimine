'use strict';

const mongoose = require('mongoose');
const Artist = require('./artist');
const Track = require('./track');
const request = require('../lib/request');
const playlistManager = require('../lib/playlist');

const userSchema = mongoose.Schema({
  private: {
    type: Boolean,
    default: false
  },

  username: {
    type: String,
    index: true,
    required: true
  },

  accessToken: {
    type: String,
    required: true
  },

  refreshToken: {
    type: String,
    required: false
  },

  displayName: {
    type: String
  },

  birthdate: {
    type: Date
  },

  country: {
    type: String
  },

  email: {
    type: String
  },

  followers: {
    type: mongoose.Schema.Types.Mixed
  },

  images: [{
    type: mongoose.Schema.Types.Mixed
  }],

  uri: {
    type: String
  },

  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }],

  artists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],

  playlists: [{
    playlistId: {
      type: String
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

userSchema.statics.upsertBySpotify = function (data) {
  return this
    .findOne({ username: data.username })
    .then(user => {
      if (user) {
        Object.assign(user, data);
        return user.save();
      }

      const newUser = new this(data);
      return newUser.save();
    })
  ;
};

userSchema.statics.createPlaylistForUser = function (user, currentUser) {
  const playlistName = `Best of ${user.displayName || user.username}`;

  return playlistManager
    .createPlaylist(currentUser, playlistName)
    .then(playlistId => playlistManager.addTracks(currentUser, user.tracks, playlistId))
    .then(playlistId => {
      const playlists = currentUser.playlists || [];
      playlists.push({
        playlistId,
        user: user._id
      });

      currentUser.playlists = playlists;
      return currentUser.save();
    })
  ;
};

userSchema.methods.upsertArtists = function () {
  return request(this.accessToken, 'artists')
    .then(artists => {
      const promises = [];

      for (const artist of artists) {
        promises.push(Artist.upsertFromSpotify(artist));
      }

      return Promise.all(promises);
    })
    .then(artists => {
      this.artists = artists;
      return this.save();
    })
    .catch(err => {
      console.log(`Artists save error: ${err}`);
    })
  ;
};

userSchema.methods.upsertTracks = function () {
  return request(this.accessToken, 'tracks')
    .then(tracks => {
      const promises = [];

      for (const track of tracks) {
        promises.push(Track.upsertFromSpotify(track));
      }

      return Promise.all(promises);
    })
    .then(tracks => {
      this.tracks = tracks;
      return this.save();
    })
    .catch(err => {
      console.log(`Track save error: ${err}`);
    })
  ;
};

module.exports = mongoose.model('User', userSchema);
