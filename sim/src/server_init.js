'use strict';

const { initDatabaseConnection } = require("./db");
const { spinWatchdogs } = require('./watchdogs/manageWatchdogs');

module.exports = async function() {
    await initDatabaseConnection();
    await spinWatchdogs();
}
