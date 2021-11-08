'use strict';

const { StatusCodes } = require('http-status-codes');
const createTemplate = require('../utils/createTemplate');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

describe('Create project (Unauthorized)', function() {
    test('Create project (Unauthorized)', async function() {
        const payload = {
            template_id: 'some-id',
        }
        const response = await
            getTestAgent()
            .post(`/${testUsers.alice.username}`)
            .send(payload);
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Create project (Bad template id)', function() {
    test('Create project (Bad template id)', async function() {
        const payload = {
            template_id: 'some-id',
        }
        const response = await
            getTestAgent()
            .post(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send(payload);
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Create project (Non-existing template id)', function() {
    test('Create project (Non-existing template id)', async function() {
        const payload = {
            template_id: '012345678901234567890123', // Valid 24-char hex, but non-existing.
        }
        const response = await
            getTestAgent()
            .post(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send(payload);
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Create project', function() {
    test('Create project', async function() {
        const template_id = await createTemplate();
        const payload = { template_id };
        const response = await
            getTestAgent()
            .post(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send(payload);
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    })
})
