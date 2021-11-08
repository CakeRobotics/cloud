const get = require("../../../utils/openshift/get");
const pushLog = require("../../../utils/pushLog");

const waitForBuildFinish = async (buildConfigName, simulationObject) => {
    const timeout = 20 * 60_000;
    const breakTimestamp = (new Date()).getTime() + timeout;
    while (true) {
        const timestamp = (new Date()).getTime();
        if (timestamp > breakTimestamp) {
            throw "Build timed out.";
        }
        const builds = await get('builds');
        const match = builds.find(build => build.name.match(buildConfigName));
        if (!match) {
            throw "Requested build is not running";
        }
        if (match.status === "Complete") {
            return;
        }
        if (match.status.match("Failed")) {
            await pushLog(simulationObject._id, "build", match.status, 4);
            throw "Failed to build user code image.";
        }
    }
}

module.exports = waitForBuildFinish;
