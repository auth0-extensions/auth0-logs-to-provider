const tools = require('auth0-extension-express-tools');

const expressApp = require('./server');
const config = require('./server/lib/config');
const logger = require('./server/lib/logger');

const createServer = tools.createServer((config, storage) => {
  logger.info('Starting Logs to Cloudwatch extension - Version:', process.env.CLIENT_VERSION);
  return expressApp(config, storage);
});

module.exports = (context, req, res) => {
  config.setValue('PUBLIC_WT_URL', tools.urlHelpers.getWebtaskUrl(req));
  createServer(context, req, res);
};
