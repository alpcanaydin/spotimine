'use strict';

const User = require('../model/user');

module.exports = (req, res) => {
  const username = req.params.username;

  if (!req.user) {
    req.session.savePlaylist = username;
    req.session.save();

    res.redirect('/auth/spotify');
    return;
  }

  User
    .findOne({ username })
    .populate({
      path: 'tracks',
      select: 'uri'
    })
    .then(user => {
      if (user === null) {
        return Promise.reject();
      }

      if (!user.tracks.length) {
        return Promise.reject();
      }

      for (const playlist of req.user.playlists) {
        if (playlist.user.toString() === user._id.toString()) {
          return true;
        }
      }

      return User.createPlaylistForUser(user, req.user);
    })
    .then(() => res.redirect(`/${username}`))
    .catch(() => res.redirect('/error'))
  ;
};
