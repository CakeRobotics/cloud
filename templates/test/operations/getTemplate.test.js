'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

describe('Get template (Invalid ID format)', function() {
    test('Get template (Invalid ID format)', async function() {
        const id = 'an-invalid-id-format';

        // Get template
        const response = await
            getTestAgent()
            .get(`/all/${id}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Get template (Valid format, but non-existing)', function() {
    test('Get template (Valid format, but non-existing)', async function() {
        const id = '012345678901234567890123'; // Valid 24-char hex.

        // Get template
        const response = await
            getTestAgent()
            .get(`/all/${id}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Get template', function() {
    test('Get template', async function() {
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

        // Get template
        const response = await
            getTestAgent()
            .get(`/all/${id}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const receivedTemplate = response.body;
        expect(receivedTemplate).toMatchObject(template);
    })
})
