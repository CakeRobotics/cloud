const { StatusCodes } = require('http-status-codes');
const createProject = require('./createProject');
const getTestAgent = require('./getTestAgent');

const createSimulation = async (user) => {
    const projectId = await createProject(user);
    const payload = { projectId }
    const creationResponse = await
        getTestAgent()
        .post('/')
        .set('Authorization', `Bearer ${user.token}`)
        .send(payload);
    expect(creationResponse.statusCode).toEqual(StatusCodes.ACCEPTED);
    const { simulationId } = creationResponse.body;
    return simulationId;
}

module.exports = createSimulation;
