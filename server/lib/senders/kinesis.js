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
  // these are the max number of records that can be sent to kinesis
  const maxRecords = 500;

  const chunk = (array, size) => {
    const chunked_arr = [];
    let copied = [...array];
    const numOfChild = Math.ceil(copied.length / size);
    for (let i = 0; i < numOfChild; i++) {
      chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
  };


   return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Kinesis...`);

    const chunks = chunk(logs, maxRecords);

    chunks.forEach(logChunk => {
      const records = logChunk.map((log) => {
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
