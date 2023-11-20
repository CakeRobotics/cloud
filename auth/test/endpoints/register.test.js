const { StatusCodes } = require('http-status-codes');
const getRegistrationToken = require('../utils/getRegistrationToken');
const getTestAgent = require('../utils/getTestAgent');


describe('Register OK', function() {
    test('Register OK', async function() {
        // Create registration token
        const registrationToken = await getRegistrationToken("test@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test-register",
                password: "test-password",
                email: "test@example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    })
})

describe('Register duplicate', function() {
    test('Register duplicate', async function() {
        const registrationToken = await getRegistrationToken("test@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test-register",
                password: "test-password",
                email: "test@example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    })
})

describe('Register bad username', function() {
    test('Register bad username', async function() {
        const registrationToken = await getRegistrationToken("test_bad_username@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test_register",
                password: "test-password",
                email: "test_bad_username@example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Register bad password', function() {
    test('Register bad password', async function() {
        const registrationToken = await getRegistrationToken("test_bad_password@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test-register",
                password: "123",
                email: "test_bad_password@example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Register bad email', function() {
    test('Register bad email', async function() {
        const registrationToken = await getRegistrationToken("test_bad_email.example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test-register",
                password: "test-password",
                email: "test_bad_email.example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })
})

describe('Unathorized admin type register', function() {
    test('Unathorized admin type register', async function() {
        const registrationToken = await getRegistrationToken("test_unauthorized_admin@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test-register",
                password: "test-password",
                email: "test_unauthorized_admin@example.com",
                type: "admin",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.NOT_IMPLEMENTED);
    })
})
