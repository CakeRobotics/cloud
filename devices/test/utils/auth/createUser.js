'use strict';

const { StatusCodes } = require('http-status-codes');
const supertest = require('supertest');

module.exports = async function(username, password, email) {
    const response = await
    supertest(process.env.AUTH_SERVICE)
    .post('/register')
    .send({
        username,
        password,
        email,
    })
    expect(response.statusCode).toEqual(StatusCodes.CREATED);
}
