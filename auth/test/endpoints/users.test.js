const { StatusCodes } = require('http-status-codes');
const getRegistrationToken = require('../utils/getRegistrationToken');
const getSuperAdminToken = require('../utils/getSuperAdminToken');
const getTestAgent = require('../utils/getTestAgent');

describe('Register user', function() {
    test('Register user', async function() {
        // Create registration token
        const registrationToken = await getRegistrationToken("carol@example.com");
        const response = await
            getTestAgent()
            .post('/register')
            .send({
                username: "carol",
                password: "test-password",
                email: "carol@example.com",
                registrationToken,
            })
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    })
})

describe('Unauthorized get user info', function() {
    test('Unauthorized get user info', async function() {
        const response = await
            getTestAgent()
            .get('/users/carol')
            .send();
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Authorized get user info', function() {
    test('Authorized get user info', async function() {
        // Login as admin
        const adminToken = await getSuperAdminToken();

        // Create registration token
        const response = await
            getTestAgent()
            .get('/users/carol')
            .set('Authorization', `Bearer ${adminToken}`)
            .send();
        expect(response.statusCode).toEqual(StatusCodes.OK);
        const data = JSON.parse(response.text);
        expect(data).toMatchObject({
            username: 'carol',
            email: 'carol@example.com',
            type: 'normal',
        })
    })
})
