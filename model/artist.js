'use strict';

const mongoose = require('mongoose');
const artistMapper = require('../lib/mapper/artist');

const artistSchema = mongoose.Schema({
  external_urls: {
    type: mongoose.Schema.Types.Mixed
  },

  followers: {
    type: mongoose.Schema.Types.Mixed
  },

  genres: [{
    type: String
  }],

  href: {
    type: String
  },

  spotify_id: {
    type: String,
    index: true
  },

  images: [{
    type: mongoose.Schema.Types.Mixed
  }],

  name: {
    type: String
  },

  popularity: {
    type: Number
  },

  type: {
    type: String
  },

  uri: {
    type: String
  }
}, {
  timestamps: true
});

artistSchema.statics.upsertFromSpotify = function (data) {
  const mappedData = artistMapper(data);

  return this
    .findOne({ spotify_id: mappedData.spotify_id })
    .then(artist => {
      if (artist === null) {
        const newArtist = new this(mappedData);
        return newArtist.save();
      }

      return artist;
    })
    .then(artist => artist._id)
  ;
};

module.exports = mongoose.model('Artist', artistSchema);
