'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

describe('Create template (Unauthorized)', function() {
    test('Create template (Unauthorized)', async function() {
        const template = {
            name: "My test robot",
            tags: [
                "ground",
                "lidar"
            ]
        }

        const response = await
            getTestAgent()
            .post(`/all`)
            .send(template);
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Create template', function() {
    test('Create template', async function() {
        const template = {
            name: "My test robot",
            tags: [
                "ground",
                "lidar"
            ]
        }

        const response = await
            getTestAgent()
            .post(`/all`)
            .set('Authorization', `Bearer ${testUsers.admin.token}`)
            .send(template);
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    })
})
