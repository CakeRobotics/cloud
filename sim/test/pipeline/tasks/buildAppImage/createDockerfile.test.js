const createDockerfile = require('../../../../src/pipeline/tasks/buildAppImage/createDockerfile');
const storeUserCodeInTempDir = require('../../../../src/pipeline/tasks/buildAppImage/storeUserCodeInTempDir');
const randomString = require('../../../utils/randomString');
const fs = require('fs');


test('createDockerfile', async function() {
    const simulationId = randomString();
    const simulationObject = {
        _id: simulationId,
        projectFiles: {
            props: {},
            mainfile: "code",
        }
    }
    const dir = await storeUserCodeInTempDir(simulationObject);
    await createDockerfile(simulationObject, dir);
    expect(fs.existsSync(`/tmp/sim-${simulationId}/Dockerfile`)).toBeTruthy();
    expect(fs.readFileSync(`/tmp/sim-${simulationId}/Dockerfile`, { encoding: 'utf-8' }).length > 10).toBeTruthy();
});
