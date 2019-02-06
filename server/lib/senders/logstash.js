const async = require('async');
const request = require('request');
const url = require('url');
const loggingTools = require('auth0-log-extension-tools');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const now = Date.now();
  let logstashUrl = config('LOGSTASH_URL');

  if (config('LOGSTASH_TOKEN')) {
    const parsedUrl = url.parse(logstashUrl);
    logstashUrl = (parsedUrl.query) ? `${logstashUrl}&token=${config('LOGSTASH_TOKEN')}` : `${logstashUrl}?token=${config('LOGSTASH_TOKEN')}`;
  }

  const sendLog = function(log, callback) {
    if (!log) {
      return callback();
    }

    const index = config('LOGSTASH_INDEX');
    const data = {
      post_date: now,
      type_description: loggingTools.logTypes.get(log.type)
    };

    Object.keys(log).forEach((key) => {
      data[key] = log[key];
    });

    data[index] = log[index] || 'auth0';
    data.message = JSON.stringify(log);

    const options = {
      method: 'POST',
      timeout: 2000,
      url: logstashUrl,
      headers: { 'cache-control': 'no-cache', 'content-type': 'application/json' },
      body: data,
      json: true
    };

    if (config('LOGSTASH_USER') && config('LOGSTASH_PASSWORD')) {
      options['auth'] = {
        user: config('LOGSTASH_USER'),
        pass: config('LOGSTASH_PASSWORD'),
        sendImmediately: true
      }
    }

    request(options, (err, resp, body) => {
      if (err || (resp && resp.statusCode >= 300)) {
        const error = {
          error: err || body || resp.statusMessage,
          status: (resp && resp.statusCode) || 500
        };

        return callback(error);
      }

      return callback();
    });
  };

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Logstash.`);

    async.eachLimit(logs, 10, sendLog, callback);
  };
};
