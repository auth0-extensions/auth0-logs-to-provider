const fs = require('fs');
const { logTypes: getLogTypes } = require('auth0-log-extension-tools');
const yargs = require('yargs');

const argv = yargs
  .option('provider', {
    alias: 'p',
    default: null
  })
  .argv;

(function () {
  const provider = argv.provider;
  if (!provider) {
    throw new Error('Cannot build webtask.json, provider not set.');
  }

  prepareDirectory('./dist');
  prepareDirectory(`./dist/${provider}`);

  updateLogTypes();

  const originalPackage = JSON.parse(fs.readFileSync('./package.json'));
  const commonWT = JSON.parse(fs.readFileSync('./webtask-templates/common.json'));
  const providerWT = JSON.parse(fs.readFileSync(`./webtask-templates/${provider}.json`));
  const secrets = Object.assign({}, commonWT.secrets, providerWT.secrets);

  Object.keys(secrets).forEach(key => {
    if (secrets[key] === null) delete secrets[key];
  });

  const wtJson = Object.assign({}, commonWT, providerWT, { secrets });

  const newPackage = Object.assign({}, originalPackage);
  Object.assign(newPackage['auth0-extension'], wtJson);
  newPackage.name = wtJson.name;
  newPackage.version = wtJson.version;
  newPackage.keywords = wtJson.keywords;
  const forbiddenProps = [ 'name', 'version', 'preVersion', 'author', 'keywords', 'description', 'repository' ];

  forbiddenProps.forEach(prop => {
    if (newPackage['auth0-extension'][prop] !== undefined) {
      delete newPackage['auth0-extension'][prop];
    }
  });

  try {
    const webtaskContent = JSON.stringify(wtJson, null, '  ');
    const pkgContent = JSON.stringify(newPackage, null, '  ');

    fs.writeFileSync('./webtask.json', webtaskContent + '\n');
    fs.writeFileSync(`./dist/${provider}/package.json`, pkgContent + '\n');
    console.info(`Successfully generated webtask.json for ${provider} provider`);
  } catch (e) {
    console.error(e);
    return null;
  }
}());

function updateLogTypes () {
  const options = [ { text: 'All', value: '-' }];

  for (let key in getLogTypes) {
    if (getLogTypes[key] && getLogTypes[key].name) {
      options.push({ text: getLogTypes[key].name, value: key });
    }
  }

  try {
    const wtJson = JSON.parse(fs.readFileSync('./webtask-templates/common.json'));
    wtJson.secrets.LOG_TYPES.options = options;

    const content = JSON.stringify(wtJson, null, '  ');

    fs.writeFileSync('./webtask-templates/common.json', content + '\n');

    return null;
  } catch (e) {
    console.error(e);

    return null;
  }
}

function prepareDirectory (dir) {
  try {
    fs.statSync(dir);
  } catch(e) {
    fs.mkdirSync(dir);
  }
}
