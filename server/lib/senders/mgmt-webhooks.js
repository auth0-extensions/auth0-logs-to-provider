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

  const callWebhook = (logs, callback) => {
    if (batchMode) {
      logger.info(`Sending to '${url}'.`);
      return sendRequest(logs, callback);
    }

    logger.info(`Sending to '${url}' with ${concurrentCalls} concurrent calls.`);
    return async.eachLimit(logs, concurrentCalls, sendRequest, callback);
  };

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    let endpointsFilter = config('AUTH0_API_ENDPOINTS').split(',');
    endpointsFilter = endpointsFilter.length > 0 && endpointsFilter[0] === '' ? [] : endpointsFilter;

    const requestMatchesFilter = (log) => {
      if (!endpointsFilter || !endpointsFilter.length) return true;
      const path = log.details.request && log.details.request.path;
      return path && endpointsFilter.some(filter => path.indexOf(`/api/v2/${filter}`) >= 0);
    };

    const filteredLogs = logs
      .filter(requestMatchesFilter)
      .map(log => ({
        date: log.date,
        request: log.details.request,
        response: log.details.response
      }));

    if (!filteredLogs.length) {
      return callback();
    }

    logger.info(`${filteredLogs.length} logs found.`);

    return callWebhook(filteredLogs, callback);
  };
};
