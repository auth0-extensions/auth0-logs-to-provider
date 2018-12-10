const async = require('async');
const Request = require('request');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const url = config('WEBHOOK_URL');
  const batchMode = config('SEND_AS_BATCH') === true || config('SEND_AS_BATCH') === 'true';
  const concurrentCalls = parseInt(config('WEBHOOK_CONCURRENT_CALLS'), 10) || 5;
  const headers = config('AUTHORIZATION') ? { Authorization: config('AUTHORIZATION') } : {};

  const sendRequest = (data, callback) =>
    Request({
      method: 'POST',
      url: url,
      json: true,
      headers: headers,
      body: data
    }, (err, response, body) => {
      if (err || response.statusCode < 200 || response.statusCode >= 400) {
        return callback(err || body || response.statusCode);
      }

      return callback();
    });

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`${logs.length} logs found.`);

    if (batchMode) {
      logger.info(`Sending to '${url}'.`);
      return sendRequest(logs, callback);
    }

    logger.info(`Sending to '${url}' with ${concurrentCalls} concurrent calls.`);
    return async.eachLimit(logs, concurrentCalls, sendRequest, callback);
  };
};
