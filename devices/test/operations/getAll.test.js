const { StatusCodes } = require('http-status-codes');
const getHttpAgent = require('../utils/getHttpAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

test('Get All (Unauthorized)', async function() {
    var response = await
        getHttpAgent()
        .get('/')
        .send();
    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
});

test('Get All (OK)', async function() {
    const name_1 = `device-${randomString()}`;
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.carol.token}`)
        .send({ name: name_1 });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    const name_2 = `device-${randomString()}`;
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.carol.token}`)
        .send({ name: name_2 });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.carol.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const list = response.body;
    expect(list.length).toEqual(2);
    expect(list[0].name).toEqual(name_2);
    expect(list[1].name).toEqual(name_1);
    expect(list[1].online).toEqual(false);
    expect(list[1].owner).toEqual(testUsers.carol.username);
});
