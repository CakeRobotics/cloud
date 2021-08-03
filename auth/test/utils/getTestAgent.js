const supertest = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');

beforeAll(async function() {
    console.log('Waiting for app to initialize...');
    await app.ready;
})

afterAll(async function() {
    app.server.close();
    await db.pool.end();
})

module.exports = function() {
    return supertest(app.server);
}
