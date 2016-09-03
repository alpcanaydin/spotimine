'use strict';

module.exports = (req, res) => {
  req.logOut();
  res.redirect('/');
};
