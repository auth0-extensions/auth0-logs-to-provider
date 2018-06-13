const fs = require('fs');
const { logTypes: getLogTypes } = require('auth0-log-extension-tools');

(function() {
  const options = [ { text: '', value: '-' }];

  for (let key in getLogTypes) {
    if (getLogTypes[key] && getLogTypes[key].name) {
      options.push({ text: getLogTypes[key].name, value: key });
    }
  }

  try {
    const wtJson = JSON.parse(fs.readFileSync('./webtask.json'));
    wtJson.secrets.LOG_TYPES.options = options;

    const content = JSON.stringify(wtJson, null, '  ');

    fs.writeFile('./webtask.json', content + '\n', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info('All known LogTypes are included into webtask.json');
      }
      return null;
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}());
