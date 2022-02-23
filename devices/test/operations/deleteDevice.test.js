const { StatusCodes } = require('http-status-codes');
const getHttpAgent = require('../utils/getHttpAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

test('Delete Device (Unauthorized)', async function() {
    var response = await
        getHttpAgent()
        .delete(`/${testUsers.alice.username}/my-device`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
});

test('Delete Device (Non-existing)', async function() {
    var response = await
        getHttpAgent()
        .delete(`/${testUsers.alice.username}/my-device`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
});

test('Delete Device (OK)', async function() {
    const name = `device-${randomString()}`;
    const project = `alice/project-${randomString()}`;
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name, project });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    var response = await
        getHttpAgent()
        .delete(`/${testUsers.alice.username}/${name}`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .get(`/${testUsers.alice.username}/${name}`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
});
