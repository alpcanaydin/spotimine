'use strict';

const moment = require('moment-timezone');

module.exports = data => {
  const response = {
    username: data.id,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || null,
    displayName: data.display_name || null,
    country: data.country || null,
    email: data.email || null,
    followers: data.followers || null,
    uri: data.uri || null,
    images: data.images || null,
    birthdate: null
  };

  if (data.birthdate) {
    response.birthdate = moment(data.birthdate, 'YYYY-MM-DD').toDate();
  }

  return response;
};
