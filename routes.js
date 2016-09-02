'use strict';

const homeCtrl = require('./controller/home');
const spotifyAuthCtrl = require('./controller/auth/spotify/spotify');
const spotifyCallbackCtrl = require('./controller/auth/spotify/callback');
const noAccessCtrl = require('./controller/noAccess');
const errorCtrl = require('./controller/error');
const userCtrl = require('./controller/user');

module.exports = function (app, middlewares) {
  app.get('/', homeCtrl);

  app.get('/auth/spotify',
    middlewares.passport.authenticate('spotify'),
    spotifyAuthCtrl
  );

  app.get('/auth/spotify/callback',
    spotifyCallbackCtrl(middlewares.passport)
  );

  app.get('/no-access', noAccessCtrl);
  app.get('/error', errorCtrl);

  app.get('/:username', userCtrl);
};
