'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');
const createTemplate = require('../utils/createTemplate');

describe('Get All (Unauthorized)', function() {
    test('Get All (Unauthorized)', async function() {
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Get All', function() {
    test('Get All', async function() {
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

        // Get projects
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        // const receivedList = response.body;
        // const matchedProject = receivedList.find(value => value._id === id);
        // expect(matchedProject).toBeTruthy(); // fails if match is undefined (i.e. not found)
        // expect(matchedProject).toMatchObject(project);
    })
})
