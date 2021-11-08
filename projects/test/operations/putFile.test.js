'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');
const createTemplate = require('../utils/createTemplate');

describe('Update Project (Unauthorized)', function() {
    test('Update Project (Unauthorized)', async function() {
        const id = 'an-invalid-id-format';
        const response = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${id}/props.json`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Update Project (Invalid ID format)', function() {
    test('Update Project (Invalid ID format)', async function() {
        const id = 'an-invalid-id-format';
        const response = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Update Project (Valid format, but non-existing)', function() {
    test('Update Project (Valid format, but non-existing)', async function() {
        const id = '012345678901234567890123'; // Valid 24-char hex.
        const response = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Update Project (props)', function() {
    test('Update Project (props)', async function() {
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
        const getResponse = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(getResponse.statusCode).toEqual(StatusCodes.OK);
        const props = getResponse.body;

        // Update props
        const updatedProps = {
            props,
            name: 'NewName'
        };
        const putResponse = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .set('Content-type', 'text/plain; charset=utf-8') // ATTENTION!
            .send(JSON.stringify(updatedProps));
        expect(putResponse.statusCode).toEqual(StatusCodes.OK);

        // Validate update
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${id}/props.json`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const receivedProps = JSON.parse(response.text);
        expect(receivedProps.name).toEqual('NewName');
    })
})

describe('Update Project (code)', function() {
    test('Update Project (code)', async function() {
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

        // Update code
        const updatedCode = "TEST CODE CONTENT";
        const putResponse = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${id}/main.py`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .set('Content-type', 'text/plain; charset=utf-8') // ATTENTION!
            .send(updatedCode);
        expect(putResponse.statusCode).toEqual(StatusCodes.OK);

        // Validate update
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${id}/main.py`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(response.statusCode).toEqual(StatusCodes.OK);
        expect(response.headers['content-type']).toEqual('text/plain; charset=utf-8');
        const receivedCode = response.text;
        expect(receivedCode).toEqual(updatedCode);
    })
})
