'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');
const createTemplate = require('../utils/createTemplate');

describe('Get project (Invalid ID format)', function() {
    test('Get project (Invalid ID format)', async function() {
        const id = 'an-invalid-id-format';

        // Get project
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Get project (Valid format, but non-existing)', function() {
    test('Get project (Valid format, but non-existing)', async function() {
        const id = '012345678901234567890123'; // Valid 24-char hex.

        // Get project
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Get project', function() {
    test('Get project', async function() {
        // Create project
        const template_id = await createTemplate();
        const payload = { template_id };

        const projectCreationResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send(payload);
        expect(projectCreationResponse.statusCode).toEqual(StatusCodes.CREATED);

        const id = projectCreationResponse.body;

        // Get project
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);

        // Validate project
        // TODO: Test template transformation here
        expect(response.headers['content-type']).toEqual('text/plain; charset=utf-8');
        const props = JSON.parse(response.text);
        expect(props.name).toBeTruthy();
    })
})
