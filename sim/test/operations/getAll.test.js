const { StatusCodes } = require('http-status-codes');
const createSimulation = require('../utils/createSimulation');
const { testUsers } = require('../utils/testUsers');
const getTestAgent = require('../utils/getTestAgent');

test('GetAll', async function() {
    const simulationId_1 = await createSimulation(testUsers.carol);
    const simulationId_2 = await createSimulation(testUsers.carol);
    const response = await
        getTestAgent()
        .get('/')
        .set('Authorization', `Bearer ${testUsers.carol.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const receivedSimulationsList = response.body;
    expect(receivedSimulationsList.length).toEqual(2);
    expect(receivedSimulationsList[0].id).toMatch(simulationId_2);
    expect(receivedSimulationsList[1].id).toMatch(simulationId_1);
});
