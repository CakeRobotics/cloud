'use strict';

const fs = require('fs')

module.exports = async function(username, appName, dependencies) {
    const appDir = `${process.env.USER_CODE_PATH}/${username}/${appName}`;
    await fs.promises.writeFile(`${appDir}/dependencies.json`, dependencies, 'utf-8');
}
