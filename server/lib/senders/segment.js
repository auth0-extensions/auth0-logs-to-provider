const _ = require('lodash');
const async = require('async');
const Segment = require('analytics-node');
const loggingTools = require('auth0-log-extension-tools');
const managementApi = require('auth0-extension-tools').managementApi;

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const analytics = new Segment(config('SEGMENT_KEY'));

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Segment.`);

    async.eachLimit(logs, 10, (log, cb) => {
      if (!log.user_id) {
        return cb();
      }

      return managementApi
        .getClient({
          domain: config('AUTH0_DOMAIN'),
          clientId: config('AUTH0_CLIENT_ID'),
          clientSecret: config('AUTH0_CLIENT_SECRET')
        })
        .then(auth0 => auth0.users.get({ id: log.user_id }))
        .then((user) => {
          analytics.track({
            userId: log.user_id,
            event: loggingTools.logTypes.get(log.type),
            properties: _.extend({}, user.user_metadata, _.omit(user, ['user_metadata', 'app_metadata']), user.app_metadata)
          }, cb);
        })
        .catch((err) => {
          if (err.statusCode === 404) {
            return analytics.track({
              userId: log.user_id,
              event: loggingTools.logTypes.get(log.type),
              properties: {}
            }, cb);
          }

          return cb(err);
        });
    }, callback);
  };
};
