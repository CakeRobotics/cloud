'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

describe('Delete Template (Unauthorized)', function() {
    test('Delete Template (Unauthorized)', async function() {
        const id = 'anything';

        // Delete template
        const response = await
            getTestAgent()
            .delete(`/all/${id}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Delete Template (Invalid ID format)', function() {
    test('Delete Template (Invalid ID format)', async function() {
        const id = 'an-invalid-id-format';

        // Delete template
        const response = await
            getTestAgent()
            .delete(`/all/${id}`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Delete Template (Valid format, but non-existing)', function() {
    test('Delete Template (Valid format, but non-existing)', async function() {
        const id = '012345678901234567890123'; // Valid 24-char hex.

        // Get template
        const response = await
            getTestAgent()
            .delete(`/all/${id}`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Delete Template', function() {
    test('Delete Template', async function() {
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

        // Delete template
        const response = await
            getTestAgent()
            .delete(`/all/${id}`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        
        // Verify action
        const getResponse = await
            getTestAgent()
            .get(`/all/${id}`)
            .send();
        expect(getResponse.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})
