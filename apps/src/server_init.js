'use strict';

const initMainPath = require('./code/initMainPath');
const waitForDBConnection = require('./db/waitForConnection');
const syncDB = require('./db/sync');

module.exports = async function() {
    await initMainPath();
    await waitForDBConnection();
    await syncDB();
}
