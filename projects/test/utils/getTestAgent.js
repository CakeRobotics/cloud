'use strict';

const supertest = require('supertest');
const app = require('../../src/server');
const { closeDatabaseConnection } = require('../../src/db');
const { initTestUsers } = require('./testUsers');

beforeAll(async function() {
    console.log('Waiting for app to initialize...');
    await app.ready;
    await initTestUsers();
})

afterAll(async function() {
    app.server.close();
    await closeDatabaseConnection();
})

module.exports = function() {
    return supertest(app.server);
}
