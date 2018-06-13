const Loggly = require('loggly');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const loggly = Loggly.createClient({
    token: config('LOGGLY_CUSTOMER_TOKEN'),
    subdomain: config('LOGGLY_SUBDOMAIN') || '-',
    tags: ['auth0']
  });

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Loggly.`);

    loggly.log(logs, (err) => {
      if (err) {
        logger.info('Error sending logs to Loggly', err);
        return callback(err);
      }

      logger.info('Upload complete.');

      return callback();
    });
  };
};
