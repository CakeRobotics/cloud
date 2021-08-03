const { StatusCodes } = require('http-status-codes');
const getTestAgent = require('../utils/getTestAgent');

describe('Super admin existance', function() {
    test('Super admin existance', async function() {
        const response = await
            getTestAgent()
            .post('/login')
            .send({
                username_or_email: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            })
        expect(response.statusCode).toEqual(StatusCodes.OK);
    })
})
