'use strict';

module.exports = (req, res) => {
  if (req.user) {
    res.redirect(`/${req.user.username}`);
    return;
  }

  res.render('home');
};
