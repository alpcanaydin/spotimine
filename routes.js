'use strict';

const homeCtrl = require('./controller/home');
const spotifyAuthCtrl = require('./controller/auth/spotify/spotify');
const spotifyCallbackCtrl = require('./controller/auth/spotify/callback');
const noAccessCtrl = require('./controller/noAccess');
const logoutCtrl = require('./controller/logout');
const errorCtrl = require('./controller/error');
const userCtrl = require('./controller/user');
const saveAsPlaylist = require('./controller/saveAsPlaylist');

module.exports = function (app, middlewares) {
  app.get('/', homeCtrl);

  app.get('/auth/spotify',
    middlewares.passport.authenticate('spotify'),
    spotifyAuthCtrl
  );

  app.get('/auth/spotify/callback',
    spotifyCallbackCtrl(middlewares.passport)
  );

  app.get('/save-as-playlist/:username', saveAsPlaylist);
  app.get('/no-access', noAccessCtrl);
  app.get('/error', errorCtrl);
  app.get('/logout', logoutCtrl);

  app.get('/:username', userCtrl);
};
