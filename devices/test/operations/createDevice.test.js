const { StatusCodes } = require('http-status-codes');
const getHttpAgent = require('../utils/getHttpAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

test('Create Device (Unauthorized)', async function() {
    const name = `device-${randomString()}`;
    var response = await
        getHttpAgent()
        .post('/')
        .send({ name });
    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
});

test('Create Device (Empty Payload)', async function() {
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ });
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
});

test('Create Device (OK)', async function() {
    const name = `device-${randomString()}`;
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);
});

test('Create Device (Duplicate)', async function() {
    const name = `device-${randomString()}`;
    
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name });
    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
});
