'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

describe('Update Template (Unauthorized)', function() {
    test('Update Template (Unauthorized)', async function() {
        const id = 'an-invalid-id-format';
        const response = await
            getTestAgent()
            .put(`/all/${id}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Update Template (Invalid ID format)', function() {
    test('Update Template (Invalid ID format)', async function() {
        const id = 'an-invalid-id-format';
        const response = await
            getTestAgent()
            .put(`/all/${id}`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Update Template (Valid format, but non-existing)', function() {
    test('Update Template (Valid format, but non-existing)', async function() {
        const id = '012345678901234567890123'; // Valid 24-char hex.
        const response = await
            getTestAgent()
            .put(`/all/${id}`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Update Template', function() {
    test('Update Template', async function() {
        // Create template
        const template = {
            name: "My test robot",
            tags: [
                "ground",
                "lidar"
            ]
        }
        const createResponse = await
            getTestAgent()
            .post(`/all`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send(template);
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);
        const id = createResponse.body;

        // Update Template
        const updatedTemplate = {
            name: "My test robot 2",
            tags: [
                "ground",
                "camera"
            ]
        }
        const putResponse = await
        getTestAgent()
            .put(`/all/${id}`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send(updatedTemplate);
        expect(putResponse.statusCode).toEqual(StatusCodes.OK);

        // Get template
        const response = await
            getTestAgent()
            .get(`/all/${id}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const receivedTemplate = response.body;
        expect(receivedTemplate).toMatchObject(updatedTemplate);
    })
})
