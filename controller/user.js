'use strict';

const User = require('../model/user');
const config = require('../lib/config');

module.exports = (req, res) => {
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
      let playlistUri = false;

      if (user && req.user) {
        for (const playlist of req.user.playlists) {
          if (playlist.user.toString() === user._id.toString()) {
            playlistUri = `spotify:user:${req.user.username}:playlist:${playlist.playlistId}`;
            break;
          }
        }
      }

      return res.render('user', {
        playlistUri,
        username,
        user,
        currentUser: req.user,
        bodyClass: 'user-body',
        url: config.url
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/error');
    })
  ;
};
