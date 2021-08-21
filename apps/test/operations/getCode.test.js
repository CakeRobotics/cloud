'use strict';

const fs = require('fs');

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

describe('Get Code (No authorization)', function() {
    test('Get Code (No authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/code`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Get Code (Non-existing)', function() {
    test('Get Code (Non-existing)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/code`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Get Code', function() {
    test('Get Code', async function() {
        const appName = `my-app-${randomString()}`;

        // Create App
        const createResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

        // Get Code
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/code`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);

        // Validate code against blank code template
        const code = response.text;
        const blankCodeTemplate = await fs.promises.readFile(`${__dirname}/../../assets/blank-main.py`, 'utf-8');
        expect(code).toEqual(blankCodeTemplate);
    })
})
