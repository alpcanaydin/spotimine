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
    .then(user => res.render('user', {
      username,
      user,
      currentUser: req.user,
      bodyClass: 'user-body',
      url: config.url
    }))
    .catch(() => res.redirect('/error'))
  ;
};
