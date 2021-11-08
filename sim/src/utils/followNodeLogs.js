const { ObjectId } = require('mongodb');

const { OC_CMD, OC_FIXED_ARGS } = require("../config/config.arvan");
const spawnWithLogs = require("./spawnWithLogs");
const { simulationsCollection } = require('../db');

// FIXME: Set max lines or rate limit for logs! Easily gets flooded now.
// Never await for this.
const followNodeLogs = async (simulationId) => {
    // Arvan logs socket just freaking hangs every 5 min even when not idle.
    // We currently drop all robot-logs and re-push everything.
    while (true) {
        try {
            await spawnWithLogs({
                cmd: OC_CMD,
                args: [...OC_FIXED_ARGS, "logs", "-l", `app=sim-${simulationId}`, "-c", "user-code", "-f"],
                spawnOptions: {},
                simulationId,
                logGroup: "robot-logs",
            });
        } catch (error) {
            const { state, logs } = await simulationsCollection().findOne({ _id: new ObjectId(simulationId) });
            if (state === 'up' || state === 'reloading') {
                console.error(`Logger error: ${error}`);
                console.error("Logger connection was probably dropped due to timeout.");
                console.error("Logger will try to re-attach.");

                // Delete current pod logs to avoid duplication.
                // const cleanLogs = logs.filter(log => log.group !== 'robot-logs');
                // simulationsCollection().updateOne(
                //     { _id: new ObjectId(simulationId) },
                //     { $set: { logs: cleanLogs } }
                // );
            } else {
                console.error(`Logger error: ${error}`);
                console.error(`Logger will not re-attach as simulation state is ${state}`);
                break;
            }
        }
    }
}

module.exports = followNodeLogs;
