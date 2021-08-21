'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

const exampleDependencies = [
    {
        type: "pip",
        name: "numpy",
    },
    {
        type: "pip",
        name: "scipy",
    }
];

describe('Put Dependencies (No authorization)', function() {
    test('Put Dependencies (No authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${appName}/dependencies`)
            .send(exampleDependencies);
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Put Dependencies (Non-existing)', function() {
    test('Put Dependencies (Non-existing)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${appName}/dependencies`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send(exampleDependencies);
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Put Dependencies', function() {
    test('Put Dependencies', async function() {
        const appName = `my-app-${randomString()}`;

        // Create App
        const createResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

        // Put Dependencies
        const putResponse = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${appName}/dependencies`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send(exampleDependencies);
        expect(putResponse.statusCode).toEqual(StatusCodes.OK);

        // Get Dependencies
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/dependencies`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);

        // Validate dependencies against pushed dependencies
        const receivedDependencies = JSON.parse(response.text);
        expect(receivedDependencies).toEqual(exampleDependencies);
    })
})
