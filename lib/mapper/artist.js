'use strict';

module.exports = data => {
  const response = Object.assign({}, data);
  response.spotify_id = data.id;
  delete response.id;

  return response;
};
