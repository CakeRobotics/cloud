const fs = require('fs');

const apply = require("../../../utils/openshift/apply");
const getJob = require("./getJob");
const getRoute = require("./getRoute");
const getService = require("./getService");
const waitForNodeStart = require("./waitForNodeStart");
const pushLog = require('../../../utils/pushLog');
const delete_ = require("../../../utils/openshift/delete_");

const startSimNode = async (baseSimulationObject, authHeader) => {
    const tmpWorkdir = `/tmp/sim-${baseSimulationObject._id}`;
    await fs.promises.mkdir(tmpWorkdir, { recursive: true });
    const jobObject = await getJob(baseSimulationObject, authHeader);
    const serviceObject = await getService(baseSimulationObject);
    const { host, routeObject } = await getRoute(baseSimulationObject);
    await apply([jobObject, serviceObject, routeObject], tmpWorkdir, baseSimulationObject._id);
    try {
        await waitForNodeStart(baseSimulationObject._id);
    } catch (error) {
        await pushLog(baseSimulationObject._id, "start-error", `${error}`, 4);
        await delete_([jobObject, serviceObject, routeObject], tmpWorkdir, baseSimulationObject._id);
        throw error;
    }
    return host;
}

module.exports = startSimNode;
