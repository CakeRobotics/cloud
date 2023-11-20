'use strict';

const { StatusCodes } = require('http-status-codes');
const supertest = require('supertest');

module.exports = async function(username, password) {
    const response = await
    supertest(process.env.AUTH_SERVICE)
    .post('/login')
    .send({
        username_or_email: username,
        password: password,
    })
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const token = response.text;
    return token;
}
