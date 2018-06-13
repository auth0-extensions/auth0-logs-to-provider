const async = require('async');
const winston = require('winston');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  require('winston-papertrail').Papertrail;

  const papertrail = new winston.Logger({
    transports: [
      new winston.transports.Papertrail({
        host: config('PAPERTRAIL_HOST'),
        port: config('PAPERTRAIL_PORT'),
        hostname: config('PAPERTRAIL_SYSTEM') || 'auth0-logs'
      })
    ]
  });

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Papertrail.`);

    async.eachLimit(logs, 5, (log, cb) => {
      papertrail.info(JSON.stringify(log), cb);
    }, (err) => {
      if (err) {
        return callback(err);
      }

      console.log('Upload complete.');
      return callback();
    });
  };
};
