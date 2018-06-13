const async = require('async');
const azure = require('azure-storage');
const moment = require('moment');
const useragent = require('useragent');

const loggingTools = require('auth0-log-extension-tools');
const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  const blobService = azure.createBlobService(config('STORAGE_ACCOUNT_NAME'), config('STORAGE_ACCOUNT_KEY'));

  const remapLogs = (record) => {
    record.type_code = record.type;
    record.type = loggingTools.logTypes.get(record.type);

    if (record.user_agent && record.user_agent.length) {
      let agent = useragent.parse(record.user_agent);
      record.os = agent.os.toString();
      record.os_version = agent.os.toVersion();
      record.device = agent.device.toString();
      record.device_version = agent.device.toVersion();
    }

    return record;
  };

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Azure Blob Storage.`);

    async.eachLimit(logs.map(remapLogs), 5, (log, cb) => {
      const date = moment(log.date);
      const url = `${date.format('YYYY/MM/DD')}/${date.format('HH')}/${log._id}.json`;

      blobService.createBlockBlobFromText(config('STORAGE_CONTAINER_NAME'), url, JSON.stringify(log), cb);
    }, (err) => {
      if (err) {
        return callback(err);
      }

      logger.info('Upload complete.');
      return callback();
    });
  };
};
