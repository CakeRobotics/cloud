'use strict';

const fs = require('fs')

module.exports = async function(username, appName, code) {
    const appDir = `${process.env.USER_CODE_PATH}/${username}/${appName}`;
    await fs.promises.writeFile(`${appDir}/main.py`, code, 'utf-8');
}
