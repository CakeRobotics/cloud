const { PYTHON_EXEC } = require('../../../config');
const spawnWithLogs = require('../../../utils/spawnWithLogs');

const createDockerfile = async (simulationObject, userCodeDir) => {
    await spawnWithLogs({
        cmd: PYTHON_EXEC,
        args: ['-m', 'cake_bundler', '.'],
        spawnOptions: { cwd: userCodeDir, timeout: 30_000 },
        simulationId: simulationObject._id,
        logGroup: 'build-app-image',
    });
}

module.exports = createDockerfile;
