'use strict';

const rp = require('request-promise');
const config = require('./config');

const endpoints = {
  tracks: `${config.spotify.api}/me/top/tracks`,
  artists: `${config.spotify.api}/me/top/artists`
};

module.exports = function (accessToken, type) {
  const options = {
    uri: `${endpoints[type]}?limit=25`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true
  };

  return rp(options)
    .then(response => {
      if (!response.hasOwnProperty('items')) {
        return Promise.reject();
      }

      return response.items;
    })
  ;
};
