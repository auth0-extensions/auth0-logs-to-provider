const Mixpanel = require('mixpanel');

const loggingTools = require('auth0-log-extension-tools');
const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const normalizeErrors = errors =>
    errors.map(err => ({ name: err.name, message: err.message, stack: err.stack }));

  const Logger = Mixpanel.init(config('MIXPANEL_TOKEN'), {
    key: config('MIXPANEL_KEY')
  });

  const sendLogs = (logs, cb) => {
    if (!logs || !logs.length) {
      cb();
    }

    Logger.import_batch(logs, function(errorList) {
      if (errorList && errorList.length > 0) {
        if (logs.length > 10) {
          const currentBatch = logs.splice(0, 10);

          return Logger.import_batch(currentBatch, function(errors) {
            if (errors && errors.length > 0) {
              logger.error(errors);
              return cb(normalizeErrors(errors));
            }

            logger.info(`${currentBatch.length} events successfully sent to mixpanel.`);
            return sendLogs(logs, cb);
          });
        }

        logger.error(errorList);

        return cb(normalizeErrors(errorList));
      }

      logger.info(`${logs.length} events successfully sent to mixpanel.`);
      return cb();
    });
  };

  return (logs, cb) => {
    if (!logs || !logs.length) {
      return cb();
    }

    logger.info(`${logs.length} logs received.`);

    const now = Date.now();
    const mixpanelEvents = logs.map((log) => {
      const eventName = loggingTools.logTypes.get(log.type);
      log.time = now;
      log.distinct_id = log.user_id || log.user_name || log.client_id || log._id;

      return {
        event: eventName,
        properties: log
      };
    });

    return sendLogs(mixpanelEvents, cb);
  };
};
