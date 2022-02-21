'use strict';

const supertest = require('supertest');
const app = require('../../src/server.js');
const { socketService } = require('../../src/socket/socketService');
const { closeDatabaseConnection } = require('../../src/db');
const { initTestUsers } = require('./testUsers');

beforeAll(async function() {
    console.log('Waiting for app to initialize...');
    await app.ready;
    await initTestUsers();
})

afterAll(async function() {
    app.server.close();
    await socketService.close();
    await new Promise(r => setTimeout(r, 0)); // Wait for "disconnect" event listener
    await closeDatabaseConnection();
})

module.exports = function() {
    return supertest(app.server);
}
