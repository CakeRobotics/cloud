const { StatusCodes } = require('http-status-codes');
const createSimulation = require('../utils/createSimulation');
const { testUsers } = require('../utils/testUsers');
const getTestAgent = require('../utils/getTestAgent');

test('GetSimulation', async function() {
    const simulationId = await createSimulation(testUsers.carol);
    const response = await
        getTestAgent()
        .get(`/${simulationId}`)
        .set('Authorization', `Bearer ${testUsers.carol.token}`)
        .send();
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const simulation = response.body;
    expect(simulation.owner).toMatch(testUsers.carol.username);
});
