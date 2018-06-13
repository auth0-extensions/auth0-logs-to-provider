const path = require('path');
const nconf = require('nconf');
const logger = require('./server/lib/logger');

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3001,
    WT_URL: 'http://localhost:3000'
  });

// Start the server.
const app = require('./server')((key) => nconf.get(key), null);

const port = nconf.get('PORT');
app.listen(port, (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Listening on http://localhost:${port}.`);
  }
});
