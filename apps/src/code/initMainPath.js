'use strict';

const mkdirp = require('mkdirp');

module.exports = async function() {
    await mkdirp(process.env.USER_CODE_PATH);
}
