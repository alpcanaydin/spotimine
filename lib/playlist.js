'use strict';

const config = require('../lib/config');
const rp = require('request-promise');

module.exports = {
  createPlaylist: (user, playlistName) => {
    const uri = `${config.spotify.api}/users/${user.username}/playlists`;

    const options = {
      uri,
      method: 'POST',
      body: {
        name: playlistName,
        public: false
      },
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json'
      },
      json: true
    };

    return rp(options)
      .then(response => {
        if (response.hasOwnProperty('id')) {
          return response.id;
        }

        return Promise.reject();
      })
    ;
  },

  addTracks: (user, tracks, playlistId) => {
    const uri = `${config.spotify.api}/users/${user.username}/playlists/${playlistId}/tracks`;
    const body = {
      uris: tracks.map(track => track.uri)
    };

    const options = {
      uri,
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json'
      },
      json: true
    };

    return rp(options)
      .then(() => playlistId)
    ;
  }
};
