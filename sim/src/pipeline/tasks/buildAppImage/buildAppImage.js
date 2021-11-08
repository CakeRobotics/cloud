const storeUserCodeInTempDir = require('./storeUserCodeInTempDir');
const createDockerfile = require('./createDockerfile');
const createBuildConfig = require('./createBuildConfig');
const startBuild = require('./startBuild');
const waitForBuildFinish = require('./waitForBuildFinish');
const delete_ = require('../../../utils/openshift/delete_');
const pushLog = require('../../../utils/pushLog');

const buildAppImage = async (simulationObject) => {
    const userCodeDir = await storeUserCodeInTempDir(simulationObject);
    await createDockerfile(simulationObject, userCodeDir);
    const { buildConfigName, dockerImageName, buildConfigObject } = await createBuildConfig(simulationObject, userCodeDir);
    try {
        await startBuild(buildConfigName, userCodeDir, simulationObject);
        await waitForBuildFinish(buildConfigName, simulationObject);
    } catch (error) {
        await pushLog(simulationObject._id, "build-error", `${error}`, 4);
        await delete_([buildConfigObject], userCodeDir, simulationObject._id);
        throw error;
    }
    await delete_([buildConfigObject], userCodeDir, simulationObject._id);
    return {
        dockerImageName,
        tmpWorkdir: userCodeDir,
    };
}

module.exports = buildAppImage;
