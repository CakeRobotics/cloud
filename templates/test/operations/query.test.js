'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

describe('Get All', function() {
    test('Get All', async function() {
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

        // Get templates
        const response = await
            getTestAgent()
            .get(`/all`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const receivedList = response.body;
        const matchedTemplate = receivedList.find(value => value._id === id);
        expect(matchedTemplate).toBeTruthy(); // fails if match is undefined (i.e. not found)
        expect(matchedTemplate).toMatchObject(template);
    })
})
