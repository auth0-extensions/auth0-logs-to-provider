const { Logging } = require('@google-cloud/logging');
const moment = require('moment');

const { logTypes } = require('auth0-log-extension-tools');
const config = require('../config');
const logger = require('../logger');

function toGCPSeverity(severity) {
  switch (severity) {
    case 'success':
      return 200; // INFO
    case 'warning':
      return 400; // WARNING
    case 'error':
      return 500; // ERROR
    default:
      return 0;
  }
}

module.exports = () => {
  const credentials = JSON.parse(config('GCLOUD_CREDENTIALS'));
  const projectId = config('GCLOUD_PROJECT_ID') || credentials.project_id;
  const logName = config('GCLOUD_LOG_NAME');
  const loggingConfig = {
    projectId,
    credentials: {
      private_key: credentials.private_key.replace(/\\n/g, '\n'),
      client_email: credentials.client_email
    }
  };
  const resource = {
    type: 'global'
  };

  const logging = new Logging(loggingConfig);

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Google Cloud Logging.`);

    const entries = logs.map(log => {
      const type = logTypes[log.type];
      const severity = type ? toGCPSeverity(type.severity) : 0;
      const timestamp = moment(log.date).toDate();
      const entry = {
        logName,
        resource,
        timestamp,
        severity
      };
      return logging.entry(entry, log);
    });

    logging
      .write(entries)
      .then(result => {
        callback(null, result);
      })
      .catch(err => {
        callback(err);
      });
  };
};
