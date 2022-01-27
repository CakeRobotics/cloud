const { OC_CMD, OC_FIXED_ARGS } = require("../config");
const spawnWithLogs = require('../utils/spawnWithLogs');

const stopSimulation_pipeline = async (simulationId) => {
    // Delete
    objects = [
        `jobs/sim-${simulationId}`,
        `services/sim-${simulationId}`,
        `routes/sim-${simulationId}`,
    ];
    await spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'delete', ...objects],
        spawnOptions: { timeout: 60_000 },
        simulationId,
        logGroup: 'stop-sim',
    });
}

module.exports = stopSimulation_pipeline;
