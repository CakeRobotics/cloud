'use strict';

const createUser = require('./auth/createUser');
const getToken = require('./auth/getToken');
const randomString = require('./randomString');

var testUsers = {
    alice: {
        username: `alice-${randomString()}`,
        token: null,
    },
    bob: {
        username: `bob-${randomString()}`,
        token: null,
    },
    carol: {
        username: `carol-${randomString()}`,
        token: null,
    },
    admin: {
        username: process.env.TEST_ADMIN_USERNAME,
        token: null,
    }
};


const initTestUsers = async function() {
    const PASSWORD = '123456';

    await createUser(testUsers.alice.username, PASSWORD, `${testUsers.alice.username}@example.com`);
    testUsers.alice.token = await getToken(testUsers.alice.username, PASSWORD);

    await createUser(testUsers.bob.username, PASSWORD, `${testUsers.bob.username}@example.com`);
    testUsers.bob.token = await getToken(testUsers.bob.username, PASSWORD);

    await createUser(testUsers.carol.username, PASSWORD, `${testUsers.carol.username}@example.com`);
    testUsers.carol.token = await getToken(testUsers.carol.username, PASSWORD);

    testUsers.admin.token = await getToken(process.env.TEST_ADMIN_USERNAME, process.env.TEST_ADMIN_PASSWORD);
}

module.exports = {
    initTestUsers,
    testUsers,
}