const { spawn } = require('child_process');
const pushLog = require('./pushLog');

const spawnWithLogs = async ({ cmd, args, spawnOptions, simulationId, logGroup }) => {
    return new Promise((resolve, reject) => {
        const process = spawn(cmd, args, spawnOptions);
        process.on("close", (exitCode) => {
            if (exitCode == 0) {
                resolve();
            } else {
                const errorMessage = `Command ${cmd} ${args} failed with exit code ${exitCode}.`;
                pushLog(simulationId, logGroup, errorMessage, 4, true);
                reject(errorMessage);
            }
        });
        process.stdout.on("data", (data) => {
            console.log(`[sim-${simulationId}] ${data.toString()}`);
            pushLog(simulationId, logGroup, data.toString());
        });
        process.stderr.on("data", (data) => {
            console.error(`[sim-${simulationId}] ${data.toString()}`);
            pushLog(simulationId, logGroup, data.toString(), 4);
        })
    });
}

module.exports = spawnWithLogs;
