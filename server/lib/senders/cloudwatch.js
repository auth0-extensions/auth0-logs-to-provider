const AWS = require('aws-sdk');

const config = require('../config');
const logger = require('../logger');

module.exports = () => {
  AWS.config.update({
    accessKeyId: config('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config('AWS_SECRET_KEY'),
    region: config('AWS_REGION')
  });

  const cwOpts = {
    stream: config('CLOUDWATCH_LOG_STREAM_NAME'),
    group: config('CLOUDWATCH_LOG_GROUP_NAME'),
    token: null
  };

  const cWatch = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' });

  const updateSequenceToken = (cb) => {
    const options = {
      logGroupName: cwOpts.group,
      logStreamNamePrefix: cwOpts.stream,
      limit: 1
    };
    cWatch.describeLogStreams(options, (err, result) => {
      if (result &&
        result.logStreams &&
        result.logStreams.length === 1 &&
        result.logStreams[0].uploadSequenceToken) {
        cwOpts.token = result.logStreams[0].uploadSequenceToken;

        return cb();
      }

      return cb(err || `Cannot find Log Stream - logGroupName: ${cwOpts.group}, logStreamName: ${cwOpts.stream}`);
    })
  };

  return (logs, callback) => {
    if (!logs || !logs.length) {
      return callback();
    }

    logger.info(`Sending ${logs.length} logs to Cloudwatch...`);

    const events = logs.map(log => ({ timestamp: new Date().getTime(), message: JSON.stringify(log) }));
    const options = {
      logStreamName: cwOpts.stream,
      logGroupName: cwOpts.group,
      logEvents: events,
      sequenceToken: cwOpts.token
    };

    cWatch.putLogEvents(options,
      (err, result) => {
        if (err && err.code === 'InvalidSequenceTokenException') {
          return updateSequenceToken(stErr => callback(stErr || err))
        }

        if (result && result.nextSequenceToken) {
          cwOpts.token = result.nextSequenceToken;
        }

        callback(err, result);
      });
  };
};
