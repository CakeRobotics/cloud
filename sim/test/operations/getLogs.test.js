const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
const pushLog = require('../../src/utils/pushLog');
const createSimulation = require('../utils/createSimulation');
const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

test('Get Logs (Unauthorized)', async function() {
    const simulationId = await createSimulation(testUsers.alice);
    const response = await
        getTestAgent()
        .get(`/${simulationId}/logs`)
        .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);

});

test('Get Logs', async function() {
    const simulationId = await createSimulation(testUsers.alice);

    // Internally push some logs
    const _simulationId = ObjectId(simulationId);
    await pushLog(_simulationId, 'test-1', 'some-log');
    await pushLog(_simulationId, 'test-2', 'another-log');

    // Request simulation logs
    const response = await
        getTestAgent()
        .get(`/${simulationId}/logs`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);

    // Assert pushed log exists
    const logs = response.body;
    expect(logs.length).toEqual(2);
    expect(logs[0].group).toMatch('test-1');
    expect(logs[0].message).toMatch('some-log');

    // Test group filter
    const filteredResponse = await
        getTestAgent()
        .get(`/${simulationId}/logs?group=test-2`)
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send();
    expect(filteredResponse.statusCode).toEqual(StatusCodes.OK);
    const filteredLogs = filteredResponse.body;
    expect(filteredLogs.length).toEqual(1);
    expect(filteredLogs[0].group).toMatch('test-2');
    expect(filteredLogs[0].message).toMatch('another-log');
});
