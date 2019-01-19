const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

function CheckSecretsExist() {
  const secrets = path.join(__dirname, '..', 'secrets', 'oauth.json');

  if (!fs.existsSync(secrets)) {
    throw new Error(
      chalk.whiteBright.bgRed.bold(
        'The secrets file is not given. OAuth wit iNaturalist requires a JSON file with an object with the following keys INATURALIST_APP_ID and INATURALIST_APP_SECRET'
      )
    );
  }
}

CheckSecretsExist();
