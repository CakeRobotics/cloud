const { StatusCodes } = require('http-status-codes');
const getHttpAgent = require('../utils/getHttpAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

test('Validate Device Token (Bad Token)', async function() {
    const deviceName = `device-${randomString()}`;
    const projectId = `project-${randomString()}`;
    const projectFullId = `${testUsers.alice.username}/${projectId}`;

    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name: deviceName });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    var response = await
        getHttpAgent()
        .post(`/assign_project`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({
            devices: [{
                owner: testUsers.alice.username,
                name: deviceName,
            }],
            project: projectFullId
        });
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .post('/check_access')
        .send({ token: 'bad-token', projectId: projectFullId });
    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
});

test('Validate Device Token (Bad Project ID)', async function() {
    const deviceName = `device-${randomString()}`;
    const projectId = `project-${randomString()}`;
    const projectFullId = `${testUsers.alice.username}/${projectId}`;

    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name: deviceName });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    var response = await
        getHttpAgent()
        .post(`/assign_project`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({
            devices: [{
                owner: testUsers.alice.username,
                name: deviceName,
            }],
            project: projectFullId
        });
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const { token } = response.body.find(device => device.name === deviceName);

    var response = await
        getHttpAgent()
        .post('/check_access')
        .send({ token, projectId: 'bad-project-id' });
    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
});

test('Validate Device Token (Bad Project ID)', async function() {
    const deviceName = `device-${randomString()}`;
    const projectId = `project-${randomString()}`;
    const projectFullId = `${testUsers.alice.username}/${projectId}`;

    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name: deviceName });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    var response = await
        getHttpAgent()
        .post(`/assign_project`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({
            devices: [{
                owner: testUsers.alice.username,
                name: deviceName,
            }],
            project: projectFullId
        });
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const { token } = response.body.find(device => device.name === deviceName);

    var response = await
        getHttpAgent()
        .post('/check_access')
        .send({ token, projectId: projectFullId });
    expect(response.statusCode).toEqual(StatusCodes.OK);
});
