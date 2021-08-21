'use strict';

const db = require('./db');

module.exports = async function() {
    await db.sync({alter: true}); // CRITICAL TODO: remove `alter: true` after stable version is achieved.
}