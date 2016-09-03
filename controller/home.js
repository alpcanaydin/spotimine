'use strict';

const config = require('../lib/config');

module.exports = (req, res) => {
  if (req.user) {
    res.redirect(`/${req.user.username}`);
    return;
  }

  res.render('home', { url: config.url });
};
