const yargs = require('yargs');
const glob = require('glob');
const npmRun = require('npm-run');
const fs = require('fs');

const argv = yargs
  .option('provider', {
    alias: 'p',
    default: null
  })
  .argv;

(function () {
  const providers = glob
    .sync(`./server/lib/senders/*.js`)
    .map((filepath) => {
      const dirs = filepath.split('/');
      const name = dirs[dirs.length - 1];
      return name.replace('.js', '');
    });

  if (argv.provider) {
    if (providers.indexOf(argv.provider) < 0) {
      console.log(`Unsupported provider - ${argv.provider}`);
      process.exit(1);
    }
    buildProvider(argv.provider);
  } else {
    console.log('Provider not specified. Building all known providers...');
    providers.forEach(buildProvider);
  }

  process.exit(0);
}());

function buildProvider (providerName) {
  console.log(`Building logs-to-${providerName} extension...`);

  prepareDirectory(providerName);
  npmRun.sync(`rimraf dist/${providerName}`);
  const command = `npm run prepareWebtask -- --provider=${providerName} && ` +
    `cross-env A0EXT_PROVIDER=${providerName} a0-ext build:server ./webtask.js ./dist/${providerName}`;

  try {
    npmRun.sync(command);
    npmRun.sync(`cp ./webtask.json ./dist/${providerName}/webtask.json`);
    console.log(`Complete! See "dist/${providerName}"`);
  } catch (e) {
    console.log(`Error occurred while trying to build ${providerName}`, e);
    process.exit(1);
  }
}

function prepareDirectory (providerName) {
  const dir = `./dist/${providerName}`;
  try {
    fs.statSync(dir);
  } catch(e) {
    fs.mkdirSync(dir);
  }
}
