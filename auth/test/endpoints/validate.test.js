const { StatusCodes } = require('http-status-codes');
const getRegistrationToken = require('../utils/getRegistrationToken');
const getTestAgent = require('../utils/getTestAgent');

describe('Register for validate tests', function() {
    test('Register for validate tests', async function() {
        const registrationToken = await getRegistrationToken("test_validate@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "test-validate",
                password: "test-password",
                email: "test_validate@example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    })
})

describe('Validate login', function() {
    test('Validate login', async function() {
        // Login
        const loginResponse = await
            getTestAgent()
            .post('/login')
            .send({
                username_or_email: "test-validate",
                password: "test-password",
            })
        expect(loginResponse.statusCode).toEqual(StatusCodes.OK);
        const token = loginResponse.text;

        // Validate
        const response = await
            getTestAgent()
            .post('/validate')
            .send({
                token
            })
        expect(response.statusCode).toEqual(StatusCodes.OK);
        responseData = JSON.parse(response.text);
        expect(responseData.username).toEqual("test-validate");
        expect(responseData.email).toEqual("test_validate@example.com");
        expect(responseData.type).toEqual("normal");
    })
})
