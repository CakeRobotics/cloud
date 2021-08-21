'use strict';

const fs = require('fs')
const mkdirp = require('mkdirp');

module.exports = async function(username, appName) {
    const appDir = `${process.env.USER_CODE_PATH}/${username}/${appName}`;
    await mkdirp(appDir);
    await fs.promises.copyFile(`${__dirname}/../../assets/blank-main.py`, `${appDir}/main.py`);
    await fs.promises.copyFile(`${__dirname}/../../assets/blank-dependencies.json`, `${appDir}/dependencies.json`);
}
