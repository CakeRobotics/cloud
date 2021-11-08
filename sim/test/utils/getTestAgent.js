'use strict';

const supertest = require('supertest');
const app = require('../../src/server');
const { closeDatabaseConnection } = require('../../src/db');
const { initTestUsers } = require('./testUsers');
const { stopWatchdogs } = require('../../src/watchdogs/manageWatchdogs');

beforeAll(async function() {
    console.log('Waiting for app to initialize...');
    await app.ready;
    await initTestUsers();
})

afterAll(async function() {
    app.server.close();
    await closeDatabaseConnection();
    await stopWatchdogs();
})

module.exports = function() {
    return supertest(app.server);
}
