'use strict';

const supertest = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db/db');
const { initTestUsers } = require('./testUsers');

beforeAll(async function() {
    console.log('Waiting for app to initialize...');
    await app.ready;
    await initTestUsers();
})

afterAll(async function() {
    app.server.close();
    await db.close();
})

module.exports = function() {
    return supertest(app.server);
}
