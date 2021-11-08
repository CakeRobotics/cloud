const { OC_CMD, OC_FIXED_ARGS } = require('../../../config');
const spawnWithLogs = require('../../../utils/spawnWithLogs');

const startBuild = async (buildConfigName, projectDir, simulationObject) => {
    await spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'start-build', buildConfigName, '--from-dir', projectDir],
        spawnOptions: { cwd: projectDir, timeout: 60_000 },
        simulationId: simulationObject._id,
        logGroup: 'build',
    });
};

module.exports = startBuild;
