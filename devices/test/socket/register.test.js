const { StatusCodes } = require('http-status-codes');
const { testUsers } = require('../utils/testUsers');
const getHttpAgent = require('../utils/getHttpAgent');
const getSocketAgent = require('../utils/getSocketAgent');
const { waitForEvent } = require('../utils/socket');
const randomString = require('../utils/randomString');

test('Register (Unauthorized)', async function() {
    const client = await getSocketAgent({ token: 'bad-token' });
    const error = await waitForEvent(client, "error");
    expect(error).toEqual('No device with such token.');
})

test('Register', async function() {
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

    // Assert device is online
    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    var { online } = response.body.find(device => device.name === deviceName);
    expect(online).toBeTruthy();

    // Get offline
    client.close();
    await new Promise(r => setTimeout(r, 3000)); // Wait for 'disconnect' event handler

    // Assert device is offline
    var response = await
        getHttpAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    var { online } = response.body.find(device => device.name === deviceName);
    expect(online).toBeFalsy();
})

