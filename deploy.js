const yargs = require('yargs');
const glob = require('glob');
const npmRun = require('npm-run');

const argv = yargs
  .option('provider', {
    alias: 'p',
    default: null
  })
  .option('url', {
    alias: 'u',
    default: null
  })
  .argv;

(function () {
  const providers = glob
    .sync(`./dist`)
    .map(filepath => filepath.split('/').pop());

  if (argv.provider) {
    if (providers.indexOf(argv.provider) < 0) {
      console.log(`Cannot find ${argv.provider} provider. Try to build it first`);
      process.exit(1);
    }
    deployProvider(argv.provider);
  } else {
    console.log('Provider not specified. Deploying all available providers...');
    providers.forEach(deployProvider);
  }

  process.exit(0);
}());

function deployProvider (providerName) {
  console.log(`Deploying logs-to-${providerName} extension...`);
  const url = argv.provider || 'http://0.0.0.0:3000/api/extensions';
  const command = `a0-ext deploy --package ./dist/${providerName}/package.zip --url ${url}`;

  try {
    npmRun.sync(command);
    console.log('Complete!');
  } catch (e) {
    console.log(`Error occurred while trying to deploy ${providerName} to ${argv.provider}`, e);
    process.exit(1);
  }
}
