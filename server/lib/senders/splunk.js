const SplunkLogger = require('splunk-logging').Logger;

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const Logger = new SplunkLogger({
    token: config('SPLUNK_TOKEN'),
    url: config('SPLUNK_URL'),
    port: config('SPLUNK_COLLECTOR_PORT') || 8088,
    path: config('SPLUNK_COLLECTOR_PATH') || '/services/collector/event/1.0',
    maxBatchCount: 0 // Manually flush events
  });

  Logger.requestOptions = {
    timeout: 5000
  };

  Logger.error = function(err, context) {
    // Handle errors here
    logger.error('error', err, 'context', context);
  };

  return (logs, cb) => {
    if (!logs || !logs.length) {
      return cb();
    }

    logs.forEach(function(entry) {
      Logger.send({ message: entry, metadata: {time: entry.date} });
    });

    logger.info(`Sending ${logs.length} logs to Splunk...`);

    Logger.flush(function(error, response, body) {
      logger.info('Splunk response', body);
      if (error) {
        return cb({ error: error, message: 'Error sending logs to Splunk' });
      }

      logger.info('Upload complete.');
      return cb();
    });
  };
};
