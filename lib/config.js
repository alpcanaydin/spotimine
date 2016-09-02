'use strict';

module.exports = (function () {
  const env = process.env.NODE_ENV || 'dev';

  if (['dev', 'stage', 'prod'].indexOf(env) === -1) {
    throw new Error(`Environment ${env} could not be found.`);
  }

  /* eslint-disable global-require */
  return require(`../config/${env}.json`);
  /* eslint-enable global-require */
})();
