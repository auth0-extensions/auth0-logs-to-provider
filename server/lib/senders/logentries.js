const async = require('async');
const moment = require('moment');
const Logentries = require('logs-to-logentries');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  // SETUP LOGENTRIES CLIENT
  const logentries = Logentries.createClient({
    url: `https://webhook.logentries.com/noformat/logs/${config('LOGENTRIES_TOKEN')}`
  });

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info('Uploading blobs...');

    return async.eachLimit(logs, 5, (log, cb) => {
      const date = moment(log.date);
      const url = `${date.format('YYYY/MM/DD')}/${date.format('HH')}/${log._id}.json`;
      logger.info(`Uploading ${url}.`);

      // logentries here...
      logentries.log(JSON.stringify(log), cb);
    }, (err) => {
      if (err) {
        return callback(err);
      }

      logger.info('Upload complete.');
      return callback();
    });
  };
};
