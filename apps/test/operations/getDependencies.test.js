'use strict';

const fs = require('fs');

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

describe('Get Dependencies (No authorization)', function() {
    test('Get Dependencies (No authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/dependencies`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Get Dependencies (Non-existing)', function() {
    test('Get Dependencies (Non-existing)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/dependencies`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Get Dependencies', function() {
    test('Get Dependencies', async function() {
        const appName = `my-app-${randomString()}`;

        // Create App
        const createResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

        // Get Dependencies
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/dependencies`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);

        // Validate dependencies against blank dependencies template
        const dependencies = JSON.parse(response.text);
        const blankDependenciesTemplate = JSON.parse(await fs.promises.readFile(`${__dirname}/../../assets/blank-dependencies.json`, 'utf-8'));
        expect(dependencies).toEqual(blankDependenciesTemplate);
    })
})
