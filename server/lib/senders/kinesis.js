const AWS = require('aws-sdk');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  AWS.config.update({
    accessKeyId: config('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config('AWS_SECRET_KEY'),
    region: config('AWS_REGION')
  });

  const kinesis = new AWS.Kinesis({ apiVersion: '2013-12-02' });
  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Kinesis...`);

    logs.forEach(log => {
      const records = log.map((log) => {
          log.id = log._id;
          delete log._id;
          return { PartitionKey: String(Math.random() * 100000), Data: JSON.stringify(log) };
      });

      const params = {
        Records: records,
        StreamName: config('STREAM_NAME')
      };

      kinesis.putRecords(params, (err, result) => {
        callback(err, result);
      });
    });
  };
};
