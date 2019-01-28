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

  updateLogTypes();

  const commonWT = JSON.parse(fs.readFileSync('./webtask-templates/common.json'));
  const providerWT = JSON.parse(fs.readFileSync(`./webtask-templates/${provider}.json`));
  const secrets = Object.assign({}, commonWT.secrets, providerWT.secrets);

  Object.keys(secrets).forEach(key => {
    if (secrets[key] === null) delete secrets[key];
  });

  const wtJson = Object.assign({}, commonWT, providerWT, { secrets });

  try {
    const content = JSON.stringify(wtJson, null, '  ');

    fs.writeFile('./webtask.json', content + '\n', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info(`Successfully generated webtask.json for ${provider} provider`);
      }
      return null;
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}());

function updateLogTypes () {
  const options = [ { text: '', value: '-' }];

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
