'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

const exampleCode = "pass";

describe('Put Code (No authorization)', function() {
    test('Put Code (No authorization)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${appName}/code`)
            .send({ code: exampleCode });
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Put Code (Non-existing)', function() {
    test('Put Code (Non-existing)', async function() {
        const appName = `my-app-${randomString()}`;

        const response = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${appName}/code`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({ code: exampleCode });
        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    })
})

describe('Put Code', function() {
    test('Put Code', async function() {
        const appName = `my-app-${randomString()}`;

        // Create App
        const createResponse = await
            getTestAgent()
            .post(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

        // Sleep 1 sec (To be able to examine lastCodeUpdate field)
        await new Promise(r => setTimeout(r, 1000));

        // Put Code
        const nominalUpdateTime = new Date(); // = now
        const putResponse = await
            getTestAgent()
            .put(`/${testUsers.alice.username}/${appName}/code`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({ code: exampleCode });
        expect(putResponse.statusCode).toEqual(StatusCodes.OK);

        // Get Code
        const getCodeResponse = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}/code`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(getCodeResponse.statusCode).toEqual(StatusCodes.OK);

        // Validate code against pushed code
        const receivedCode = getCodeResponse.text;
        expect(receivedCode).toEqual(exampleCode);

        // Get App info (to examine lastCodeUpdate)
        const getAppResponse = await
            getTestAgent()
            .get(`/${testUsers.alice.username}/${appName}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        expect(getAppResponse.statusCode).toEqual(StatusCodes.OK);

        // Verify lastCodeChange to be equal to nominalUpdateTime (< 0.5 seconds difference)
        const data = JSON.parse(getAppResponse.text);
        const lastCodeChange = new Date(data.lastCodeChange)
        const secondsDifference = Math.abs(lastCodeChange - nominalUpdateTime);
        expect(secondsDifference < 500).toBeTruthy();
    })
})
