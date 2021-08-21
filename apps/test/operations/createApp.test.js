'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

describe('Create App (No authorization)', function() {
    test('Create App (No authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Create App (Different user authorization)', function() {
    test('Create App (Different user authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.bob.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Create App', function() {
    test('Create App', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    })
})

describe('Create App (Duplicate)', function() {
    test('Create App', async function() {
        const appName = `my-app-${randomString()}`;

        const response_1 = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response_1.statusCode).toEqual(StatusCodes.CREATED);

        const response_2 = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response_2.statusCode).toEqual(StatusCodes.CONFLICT);
    })
})
