const { StatusCodes } = require('http-status-codes');
const { testUsers } = require('../utils/testUsers');
const getHttpAgent = require('../utils/getHttpAgent');
const getSocketAgent = require('../utils/getSocketAgent');
const { waitForEvent } = require('../utils/socket');
const randomString = require('../utils/randomString');

test('Push Log', async function() {
    // Create device
    const deviceName = `device-${randomString()}`;
    var response = await
        getHttpAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send({ name: deviceName });
    expect(response.statusCode).toEqual(StatusCodes.CREATED);

    // Get token
    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send({ name: deviceName });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const { token } = response.body.find(device => device.name === deviceName);

    // Create socket
    const client = await getSocketAgent({ token });

    // Wait for accept
    await waitForEvent(client, "accept");

    // Push log via socket
    client.emit('log', 'TEST_35');
    client.emit('log', 'TEST_37');

    // Assert log exists
    var response = await
        getHttpAgent()
        .get(`/${testUsers.bob.username}/${deviceName}`)
        .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const { logs } = response.body;
    expect(logs.length).toEqual(2)
    expect(logs[0].message).toEqual('TEST_35')
    expect(logs[1].message).toEqual('TEST_37')
})

