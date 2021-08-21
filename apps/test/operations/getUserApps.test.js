'use strict';

const { StatusCodes } = require('http-status-codes');

const getTestAgent = require('../utils/getTestAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

describe('Access Denied', function() {
    test('Access Denied', async function() {
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.bob.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Empty List', function() {
    test('Empty List', async function() {
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const list = JSON.parse(response.text);
        expect(list).toEqual([]);
    })
})

describe('Create and List', function() {
    test('Create App', async function() {
        // Create 2 Apps
        const appName1 = `my-app-${randomString()}`;
        const appName2 = `my-app-${randomString()}`;
        await getTestAgent()
            .post(`/${testUsers.alice.username}/${appName1}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});
        await getTestAgent()
            .post(`/${testUsers.alice.username}/${appName2}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({});

        // List the apps
        const response = await
            getTestAgent()
            .get(`/${testUsers.alice.username}`)
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);

        // Verify items and their order
        const list = JSON.parse(response.text);
        expect(list).toMatchObject([
            {
                name: appName2,
            }, {
                name: appName1,
            }
        ]);

        // Verify lastCodeChange to be set to NOW (< 0.5 seconds difference)
        const now = new Date();
        const sampleLastCodeChange = new Date(list[0].lastCodeChange)
        const secondsDifference = Math.abs(sampleLastCodeChange - now);
        expect(secondsDifference < 500).toBeTruthy();
    })
})
