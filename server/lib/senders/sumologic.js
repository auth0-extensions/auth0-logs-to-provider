const _ = require('lodash');
const uuid = require('node-uuid');
const request = require('superagent');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const session = `auth0-logs-to-sumologic-${uuid.v4()}`;

  const sendLogs = (logs, callback) => {
    if (logs.length === 0) {
      callback();
    }

    try {
      request
        .post(config('SUMOLOGIC_URL'))
        .send(logs.map(log => JSON.stringify(log)).join('\n'))
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          if (err || res.statusCode < 200 || res.statusCode >= 400) {
            const error = res.error || err.response;
            const errText = error && error.text && error.text.replace(/<\/?[^>]+>/gi, '');

            return callback(errText || err || res.statusCode);
          }

          return callback();
        });
    } catch (e) {
      return callback(e);
    }
  };

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Sumologic.`);

    const timestamp = new Date().toUTCString();
    const message = [];

    logs.forEach((log) => {
      const data = {
        sessionId: session,
        timestamp: timestamp
      };

      message.push(_.extend(data, log));
    });

    return sendLogs(message, callback);
  };
};
