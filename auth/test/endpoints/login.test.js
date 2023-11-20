const { StatusCodes } = require('http-status-codes');
const getRegistrationToken = require('../utils/getRegistrationToken');
const getTestAgent = require('../utils/getTestAgent');

describe('Register for login tests', function() {
    test('Register for login tests', async function() {
        const registrationToken = await getRegistrationToken("test_login@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test-login",
                password: "test-password",
                email: "test_login@example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    })
})

describe('Login with username', function() {
    test('Login with username', async function() {
        const response = await
            getTestAgent()
            .post('/login')
            .send({
                username_or_email: "test-login",
                password: "test-password",
            })
        expect(response.statusCode).toEqual(StatusCodes.OK);
    })
})

describe('Login with email', function() {
    test('Login with email', async function() {
        const response = await
            getTestAgent()
            .post('/login')
            .send({
                username_or_email: "test_login@example.com",
                password: "test-password",
            })
        expect(response.statusCode).toEqual(StatusCodes.OK);
    })
})

describe('Login with bad username', function() {
    test('Login with bad username', async function() {
        const response = await
            getTestAgent()
            .post('/login')
            .send({
                username_or_email: "bad-username",
                password: "test-password",
            })
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Login with bad password', function() {
    test('Login with bad password', async function() {
        const response = await
            getTestAgent()
            .post('/login')
            .send({
                username_or_email: "test_login@example.com",
                password: "bad-password",
            })
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})
