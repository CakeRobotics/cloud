'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

describe('Get App (No authorization)', function() {
    test('Get App (No authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Get App (Non-existing)', function() {
    test('Get App (Non-existing)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Get App', function() {
    test('Get App', async function() {
        const appName = `my-app-${randomString()}`;

        // Create App
        const createResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

        // Get App
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.OK);

        // Validate response
        const data = JSON.parse(response.text);
        expect(data).toMatchObject({
            name: appName,
            owner: testUsers.alice.username,
        });
        // Verify lastCodeChange to be set to NOW (< 0.5 seconds difference)
        const now = new Date();
        const lastCodeChange = new Date(data.lastCodeChange)
        const secondsDifference = Math.abs(lastCodeChange - now);
        expect(secondsDifference < 500).toBeTruthy();
    })
})

describe('Get App (Admin)', function() {
    test('Get App (Admin)', async function() {
        const appName = `my-app-${randomString()}`;

        // Create App
        const createResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

        // Get App
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.OK);
    })
})
