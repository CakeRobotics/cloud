const { StatusCodes } = require('http-status-codes');
const getHttpAgent = require('../utils/getHttpAgent');
const randomString = require('../utils/randomString');
const { testUsers } = require('../utils/testUsers');

test('Assign Project (OK)', async function() {
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
            devices: [
                {owner: testUsers.alice.username, name: deviceName},
            ],
            project: projectFullId
        });
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const { project } = response.body.find(device => device.name === deviceName);
    expect(project).toEqual(projectFullId);
});

test('Assign Project (Unset Others)', async function() {
    const deviceNames = [`device-${randomString()}`, `device-${randomString()}`, `device-${randomString()}`];
    const projectId = `project-${randomString()}`;
    const projectFullId = `${testUsers.alice.username}/${projectId}`;

    for (const deviceName of deviceNames) {
        var response = await
            getHttpAgent()
            .post('/')
            .set('Authorization', `Bearer ${testUsers.alice.token}`)
            .send({ name: deviceName });
        expect(response.statusCode).toEqual(StatusCodes.CREATED);
    }

    var response = await
        getHttpAgent()
        .post(`/assign_project`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({
            devices: [
                {owner: testUsers.alice.username, name: deviceNames[0]},
                {owner: testUsers.alice.username, name: deviceNames[1]},
                {owner: testUsers.alice.username, name: deviceNames[2]},
            ],
            project: projectFullId
        });
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    var { project } = response.body.find(device => device.name === deviceNames[0]);
    expect(project).toEqual(projectFullId);
    var { project } = response.body.find(device => device.name === deviceNames[1]);
    expect(project).toEqual(projectFullId);
    var { project } = response.body.find(device => device.name === deviceNames[2]);
    expect(project).toEqual(projectFullId);

    var response = await
        getHttpAgent()
        .post(`/assign_project`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send({
            devices: [
                {owner: testUsers.alice.username, name: deviceNames[0]},
                {owner: testUsers.alice.username, name: deviceNames[1]},
            ],
            project: projectFullId,
            unsetOthers: true,
        });
    expect(response.statusCode).toEqual(StatusCodes.OK);

    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    var { project } = response.body.find(device => device.name === deviceNames[0]);
    expect(project).toEqual(projectFullId);
    var { project } = response.body.find(device => device.name === deviceNames[1]);
    expect(project).toEqual(projectFullId);
    var { project } = response.body.find(device => device.name === deviceNames[2]);
    expect(project).toEqual('');
});
