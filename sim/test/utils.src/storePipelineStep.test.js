const { simulationsCollection, initDatabaseConnection, closeDatabaseConnection } = require('../../src/db');
const storePipelineStep = require('../../src/utils/storePipelineStep');

test('storePipelineStep', async function() {
    await initDatabaseConnection();
    const collection = await simulationsCollection();
    const simulation = {
        info: 'dummy-object',
        step: '1',
    }
    await collection.insertOne(simulation);
    const simulationId = simulation._id;
    expect((await collection.findOne({ _id: simulationId })).step).toMatch('1');
    await storePipelineStep(simulationId, '2');
    expect((await collection.findOne({ _id: simulationId })).step).toMatch('2');
    await closeDatabaseConnection();
});
