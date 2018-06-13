const appinsights = require('./appinsights');
const blobstorage = require('./blobstorage');
const cloudwatch = require('./cloudwatch');
const logentries = require('./logentries');
const loggly = require('./loggly');
const logstash = require('./logstash');
const mixpanel = require('./mixpanel');
const papertrail = require('./papertrail');
const segment = require('./segment');
const splunk = require('./splunk');
const sumologic = require('./sumologic');

module.exports = {
  appinsights,
  blobstorage,
  cloudwatch,
  logentries,
  loggly,
  logstash,
  mixpanel,
  papertrail,
  segment,
  splunk,
  sumologic
};
