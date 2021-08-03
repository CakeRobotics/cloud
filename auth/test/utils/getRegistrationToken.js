const { StatusCodes } = require('http-status-codes');
const getSuperAdminToken = require('./getSuperAdminToken');
const getTestAgent = require('./getTestAgent');

module.exports = async function(email) {
    const adminToken = await getSuperAdminToken();
    const response = await
        getTestAgent()
        .post('/createRegistrationToken')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            email,
        })
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const token = response.text;
    return token;
}