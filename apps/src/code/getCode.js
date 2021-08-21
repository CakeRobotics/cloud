'use strict';

const fs = require('fs')

module.exports = async function(username, appName) {
    const appDir = `${process.env.USER_CODE_PATH}/${username}/${appName}`;
    return await fs.promises.readFile(`${appDir}/main.py`, 'utf-8');
}
