const { StatusCodes } = require('http-status-codes');
const getTestAgent = require('./getTestAgent');

module.exports = async function() {
    const loginResponse = await
    getTestAgent()
    .post('/login')
    .send({
        username_or_email: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
    })
    expect(loginResponse.statusCode).toEqual(StatusCodes.OK);
    const token = loginResponse.text;
    return token;
}