'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

describe('Delete App (No authorization)', function() {
    test('Delete App (No authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .delete(`/${testUsers.alice.username}/${appName}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Delete App', function() {
    test('Delete App', async function() {
        const appName = `my-app-${randomString()}`;

        // Create App
        const createResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

        // Delete App
        const deleteResponse = await
            getTestAgent()
            .delete(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(deleteResponse.statusCode).toEqual(StatusCodes.OK);

        // Make sure the app is not listed anymore (NOTE: This test might need change to take pagination into account)
        const listResponse = await
            getTestAgent()
            .get(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(listResponse.statusCode).toEqual(StatusCodes.OK);
        const list = JSON.parse(listResponse.text);
        expect(list.length).toEqual(0);
    })
})
