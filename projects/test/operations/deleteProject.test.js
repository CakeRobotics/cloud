'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');
const createTemplate = require('../utils/createTemplate');

describe('Delete Project (Unauthorized)', function() {
    test('Delete Project (Unauthorized)', async function() {
        const id = 'anything';

        // Delete project
        const response = await
            getTestAgent()
            .delete(`/${testUsers.alice.username}/${id}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Delete Project (Invalid ID format)', function() {
    test('Delete Project (Invalid ID format)', async function() {
        const id = 'an-invalid-id-format';

        // Delete project
        const response = await
            getTestAgent()
            .delete(`/${testUsers.alice.username}/${id}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Delete Project (Valid format, but non-existing)', function() {
    test('Delete Project (Valid format, but non-existing)', async function() {
        const id = '012345678901234567890123'; // Valid 24-char hex.

        // Get project
        const response = await
            getTestAgent()
            .delete(`/${testUsers.alice.username}/${id}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Delete Project', function() {
    test('Delete Project', async function() {
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

        // Delete project
        const response = await
            getTestAgent()
            .delete(`/${testUsers.alice.username}/${id}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        
        // Verify action
        const getResponse = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(getResponse.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})
