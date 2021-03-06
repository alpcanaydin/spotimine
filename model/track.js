'use strict';

const mongoose = require('mongoose');
const trackMapper = require('../lib/mapper/track');
const msToTime = require('../lib/msToTime');

const trackSchema = mongoose.Schema({
  album: {
    type: mongoose.Schema.Types.Mixed
  },

  artists: [{
    type: mongoose.Schema.Types.Mixed
  }],

  disc_number: {
    type: Number
  },

  duration_ms: {
    type: Number
  },

  explicit: {
    type: Boolean
  },

  external_ids: {
    type: mongoose.Schema.Types.Mixed
  },

  external_urls: {
    type: mongoose.Schema.Types.Mixed
  },

  href: {
    type: String
  },

  spotify_id: {
    type: String,
    index: true
  },

  is_playable: {
    type: Boolean
  },

  name: {
    type: String
  },

  popularity: {
    type: Number
  },

  preview_url: {
    type: String
  },

  track_number: {
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

trackSchema
  .virtual('artistsString')
  .get(function () {
    return this.artists
      .map(
        artist => `<a href="${artist.uri}">${artist.name}</a>`
      )
      .join(', ')
    ;
  })
;

trackSchema
  .virtual('artistsStringPure')
  .get(function () {
    return this.artists
      .map(artist => artist.name)
      .join(', ')
    ;
  })
;

trackSchema
  .virtual('durationTime')
  .get(function () {
    return msToTime(this.duration_ms);
  })
;

trackSchema.statics.upsertFromSpotify = function (data) {
  const mappedData = trackMapper(data);

  return this
    .findOne({ spotify_id: mappedData.spotify_id })
    .then(track => {
      if (track === null) {
        const newTrack = new this(mappedData);
        return newTrack.save();
      }

      return track;
    })
    .then(track => track._id)
  ;
};


module.exports = mongoose.model('Track', trackSchema);
