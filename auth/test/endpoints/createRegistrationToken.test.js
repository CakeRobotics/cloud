const { StatusCodes } = require('http-status-codes');
const getSuperAdminToken = require('../utils/getSuperAdminToken');
const getTestAgent = require('../utils/getTestAgent');

describe('Unauthorized create registration token', function() {
    test('Unauthorized create registration token', async function() {
        const response = await
            getTestAgent()
            .post('/createRegistrationToken')
            .send({
                email: "test_registration_token@example.com",
            })
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
})

describe('Authorized create registration token', function() {
    test('Authorized create registration token', async function() {
        // Login as admin
        const token = await getSuperAdminToken();

        // Create registration token
        const response = await
            getTestAgent()
            .post('/createRegistrationToken')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "test_registration_token@example.com",
            })
        expect(response.statusCode).toEqual(StatusCodes.OK);
    })
})
