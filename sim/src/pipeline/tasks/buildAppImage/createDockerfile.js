const { CAKE_BUNDLER } = require('../../../config');
const spawnWithLogs = require('../../../utils/spawnWithLogs');

const createDockerfile = async (simulationObject, userCodeDir) => {
    await spawnWithLogs({
        cmd: CAKE_BUNDLER,
        args: ['.'],
        spawnOptions: { cwd: userCodeDir, timeout: 30_000 },
        simulationId: simulationObject._id,
        logGroup: 'build-app-image',
    });
}

module.exports = createDockerfile;
