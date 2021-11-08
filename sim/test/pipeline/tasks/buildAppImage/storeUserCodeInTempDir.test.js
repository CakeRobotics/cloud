const storeUserCodeInTempDir = require('../../../../src/pipeline/tasks/buildAppImage/storeUserCodeInTempDir');
const randomString = require('../../../utils/randomString');
const fs = require('fs');

test('storeUserCodeInTempDir', async function() {
    const simulationId = randomString();
    const simulationObject = {
        _id: simulationId,
        projectFiles: {
            props: {},
            mainfile: "code",
        }
    }
    await storeUserCodeInTempDir(simulationObject);
    expect(fs.existsSync(`/tmp/sim-${simulationId}`)).toBeTruthy();
    expect(fs.readFileSync(`/tmp/sim-${simulationId}/main.py`, { encoding: 'utf-8' })).toMatch("code");
    expect(fs.readFileSync(`/tmp/sim-${simulationId}/props.json`, { encoding: 'utf-8' })).toMatch("{}");
});
