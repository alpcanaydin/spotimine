'use strict';

const User = require('../model/user');

module.exports = (req, res) => {
  User
    .findOne({ username: req.params.username })
    .populate([
      {
        path: 'artists',
        select: 'id spotify_id name images uri href popularity'
      },
      {
        path: 'tracks',
        select: 'id spotify_id name uri href popularity album artists duration_ms'
      }
    ])
    .then(user => res.render('user', { user }))
    .catch(() => res.redirect('/error'))
  ;
};
