const { StatusCodes } = require('http-status-codes');
const createProject = require('../utils/createProject');
const getTestAgent = require('../utils/getTestAgent');
const { testUsers } = require('../utils/testUsers');

test('Create Simulation (Unauthorized)', async function() {
    const projectId = await createProject(testUsers.alice);
    const payload = { projectId }
    const response = await
        getTestAgent()
        .post('/')
        // .set('Authorization', `Bearer ${testUsers.bob.token}`)
        .send(payload);
    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
});

test('Create Simulation', async function() {
    const projectId = await createProject(testUsers.alice);
    const payload = { projectId }
    const response = await
        getTestAgent()
        .post('/')
        .set('Authorization', `Bearer ${testUsers.alice.token}`)
        .send(payload);
    expect(response.statusCode).toEqual(StatusCodes.ACCEPTED);
});
