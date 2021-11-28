const path = require('path');
const fs = require('fs');

function CheckSecretsExist() {
  const secrets = path.join(__dirname, '..', 'secrets', 'oauth.json');
  if (!fs.existsSync(secrets)) {
    throw new Error(
      'The secrets file is not given. OAuth wit iNaturalist requires a JSON file with an object with the following keys INATURALIST_APP_ID and INATURALIST_APP_SECRET'
    );
  }
  const apiToken = path.join(__dirname, '..', 'secrets', 'api_token.json');
  if (!fs.existsSync(apiToken)) {
    throw new Error(
      'The api_token file is not given. It is only used in DEV mode by now. Remains required though.'
    );
  }
}

CheckSecretsExist();
