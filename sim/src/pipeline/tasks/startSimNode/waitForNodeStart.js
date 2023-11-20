const { OC_CMD, OC_FIXED_ARGS } = require("../../../config/config.arvan");
const followNodeLogs = require("../../../utils/followNodeLogs");
const get = require("../../../utils/openshift/get");
const spawnWithLogs = require("../../../utils/spawnWithLogs");

const waitForNodeStart = async (simulationId) => {
    const timeout = 20 * 60_000;
    const breakTimestamp = (new Date()).getTime() + timeout;
    while (true) {
        const timestamp = (new Date()).getTime();
        if (timestamp > breakTimestamp) {
            throw "Start timed out.";
        }
        const pods = await get('pods');
        const match = pods.find(pod => pod.name.match(`sim-${simulationId}`));
        if (!match) {
            throw "Requested pod is not running";
        }
        if (match.status === "Error") {
            await spawnWithLogs({
                cmd: OC_CMD,
                args: [...OC_FIXED_ARGS, "logs", "-l", `app=sim-${simulationId}`, "-c", "user-code"],
                spawnOptions: { timeout: 30_000 },
                simulationId,
                logGroup: "robot-code-error",
            });
            throw "Error with user code.";
        }
        if (match.status === "Running" && match.ready === "2/2") {
            followNodeLogs(simulationId);
            return;
        }
    }
}

module.exports = waitForNodeStart;
