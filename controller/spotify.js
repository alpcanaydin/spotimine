'use strict';

const rp = require('request-promise');
const User = require('../model/user');
const config = require('../lib/config');
var exports = module.exports = {};

exports.saveAsPlaylist = (req, res) => {
  const username = req.params.username;

  User
    .findOne({ username })
    .populate([
      {
        path: 'artists',
        select: 'id spotify_id name images uri href popularity'
      },
      {
        path: 'tracks',
        select: 'id spotify_id name uri href popularity album artists duration_ms artistsString artistsStringPure durationTime'
      }
    ])
    .then(user => {
      const playlistName = `Best of ${user.displayName}`;
      var formData = {
        name: playlistName,
        public: false
      };
      var auth = {
        'bearer': user.accessToken
      };
      var uri = `${config.spotify.api}/users/${user.username}/playlists`;

      var options = {
        uri,
        method: 'POST',
        body: formData,
        auth,
        json: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      rp(options)
        .then(
          response => {
            var _tracks = user.tracks;
            var tracks = [];
            _tracks.forEach((item, index) => {
              tracks.push(_tracks[index].uri);
            });
            var playlistId = response.id;
            options.uri = `${uri}/${playlistId}/tracks`;
            options.body = {
              uris: tracks
            };
            rp(options)
              .then( () => {
                var playlistURI = `spotify:user:${user.username}:playlist:${playlistId}`;

                res.render('user', {
                  username: user.username,
                  user,
                  currentUser: user,
                  bodyClass: 'user-body',
                  url: config.url,
                  playlistURI
                });
              })
              .catch( () => {
                res.redirect('/');
              })
            ;
          }
        )
        .catch(err => {
          console.dir(err);
        });
    });
};