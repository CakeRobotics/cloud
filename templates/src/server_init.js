'use strict';

const { initDatabaseConnection } = require("./db");

module.exports = async function() {
    await initDatabaseConnection();
}
