const { StatusCodes } = require('http-status-codes');
const getHttpAgent = require('../utils/getHttpAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

test('Get Project Source (Unauthorized)', async function() {
    const deviceName = `device-${randomString()}`;

    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ name: deviceName });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    var response = await
        getHttpAgent()
        .get(`/${testUsers.alice.username}/${deviceName}/src/main.py`)
        .set('Authorization', `Device x`)
        .send();
    expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
});


test('Get Project Source (OK)', async function() {
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
        .post(`/${testUsers.alice.username}/${deviceName}/assign_project`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({ project: projectFullId });
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const { project, token } = response.body.find(device => device.name === deviceName);
    expect(project).toEqual(projectFullId);

    var response = await
        getHttpAgent()
        .get(`/${testUsers.alice.username}/${deviceName}/src/main.py`)
        .set('Authorization', `Device ${token}`)
        .send();
    expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual(`https://cloud.cakerobotics.com/api/projects/${testUsers.alice.username}/${projectId}/main.py`)
});
