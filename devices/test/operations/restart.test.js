const { StatusCodes } = require('http-status-codes');
const { testUsers } = require('../utils/testUsers');
const getHttpAgent = require('../utils/getHttpAgent');
const getSocketAgent = require('../utils/getSocketAgent');
const { waitForEvent } = require('../utils/socket');
const randomString = require('../utils/randomString');

test('Restart', async function() {
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

    // Restart
    restartEvent = waitForEvent(client, "restart");
    var response = await
        getHttpAgent()
        .post(`/restart`)
        .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send({ devices: [{
            owner: testUsers.bob.username,
            name: deviceName,
        }] });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    await restartEvent;

    // Close
    client.close();
});
