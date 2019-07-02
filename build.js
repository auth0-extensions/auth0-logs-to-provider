const yargs = require('yargs');
const glob = require('glob');
const npmRun = require('npm-run');
const fs = require('fs');

const argv = yargs
  .option('provider', {
    alias: 'p',
    default: null
  })
  .option('manifest', {
    alias: 'm',
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

  if (argv.manifest) {
    const manifest = JSON.parse(fs.readFileSync(argv.manifest));
    const pkg = JSON.parse(fs.readFileSync('./package.json'));

    (manifest[pkg.version] || []).forEach(buildProvider);

    return process.exit(0);
  }
  if (argv.provider) {
    if (providers.indexOf(argv.provider) < 0) {
      console.log(`Unsupported provider - ${argv.provider}`);
      process.exit(1);
    }
    buildProvider(argv.provider);

    return process.exit(0);
  }

  console.log('Provider not specified. Building all known providers...');
  providers.forEach(buildProvider);

  process.exit(0);
}());

function buildProvider (providerName) {
  console.log(`Building logs-to-${providerName} extension...`);

  npmRun.sync(`rimraf dist/${providerName}`);
  const command = `npm run prepareMetadata -- --provider=${providerName} && ` +
    `cross-env A0EXT_PROVIDER=${providerName} a0-ext build:server ./webtask.js ` +
    `./dist/${providerName} --pkg ./dist/${providerName}/package.json`;

  const { name, version } = JSON.parse(fs.readFileSync(`./webtask-templates/${providerName}.json`));
  const packCommand = `a0-ext package --pkg ./dist/${providerName}/package.json --bundle ` +
    `./dist/${providerName}/${name}.extension.${version}.js --out ./dist/${providerName}`;

  try {
    npmRun.sync(command);
    npmRun.sync(`cp ./webtask.json ./dist/${providerName}/webtask.json`);
    npmRun.sync(packCommand);
    console.log(`Complete! See "dist/${providerName}"`);
  } catch (e) {
    console.log(`Error occurred while trying to build ${providerName}`, e);
    process.exit(1);
  }
}

