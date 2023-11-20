const deleteLongRunningBuilds = require("./deleteLongRunningBuilds");
const deleteLongRunningSimulations = require("./deleteLongRunningSimulations");
const deleteDanglingResources = require("./deleteDanglingResources");

var intervalHandles = [];

const spinWatchdogs = async () => {
    intervalHandles = [
        setInterval(deleteLongRunningSimulations, 1 * 60_000),
        setInterval(deleteDanglingResources, 1 * 60_000),
        setInterval(deleteLongRunningBuilds, 1 * 60_000)
    ];
}

const stopWatchdogs = async () => {
    for (const interval of intervalHandles) {
        clearInterval(interval);
    }
}

module.exports = {
    spinWatchdogs,
    stopWatchdogs,
};
