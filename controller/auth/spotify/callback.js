'use strict';

module.exports = passport => (req, res, next) => {
  passport.authenticate('spotify', (err, user) => {
    if (err) {
      res.redirect('/error');
      return;
    }

    if (!err && !user) {
      res.redirect('/no-access');
      return;
    }

    req.login(user, loginErr => {
      if (loginErr) {
        res.redirect('/error');
        return;
      }

      if (req.session.savePlaylist) {
        res.redirect(`/save-as-playlist/${req.session.savePlaylist}`);
        return;
      }

      res.redirect('/');
    });
  })(req, res, next);
};
