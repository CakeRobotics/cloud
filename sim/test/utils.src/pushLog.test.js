const { simulationsCollection, initDatabaseConnection, closeDatabaseConnection } = require('../../src/db');
const pushLog = require('../../src/utils/pushLog');

test('pushLog', async function() {
    await initDatabaseConnection();

    const collection = await simulationsCollection();
    const simulation = {
        info: 'dummy-object',
    }
    await collection.insertOne(simulation);
    const simulationId = simulation._id;

    var logs;
    await pushLog(simulationId, 'test-category', 'line-1');
    logs = (await collection.findOne({ _id: simulationId })).logs;
    expect(logs.length).toEqual(1);
    expect(logs[0].group).toMatch('test-category');
    expect(logs[0].message).toMatch('line-1');

    await pushLog(simulationId, 'test-category', 'line-2');
    logs = (await collection.findOne({ _id: simulationId })).logs;
    expect(logs.length).toEqual(2);
    expect(logs[0].message).toMatch('line-1');
    expect(logs[1].message).toMatch('line-2');

    await closeDatabaseConnection();
});
