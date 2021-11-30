const apply = require("../../../utils/openshift/apply");
const getJob = require("./getJob");
const getRoute = require("./getRoute");
const getDashboardRoute = require("./getDashboardRoute");
const getService = require("./getService");
const waitForNodeStart = require("./waitForNodeStart");
const pushLog = require('../../../utils/pushLog');
const delete_ = require("../../../utils/openshift/delete_");

const startSimNode = async (baseSimulationObject, dockerImageName, tmpWorkdir) => {
    const jobObject = await getJob(baseSimulationObject, dockerImageName);
    const serviceObject = await getService(baseSimulationObject);
    const { host, routeObject } = await getRoute(baseSimulationObject);
    const { dashboardHost, dashboardRouteObject } = await getDashboardRoute(baseSimulationObject);
    await apply([jobObject, serviceObject, routeObject, dashboardRouteObject], tmpWorkdir, baseSimulationObject._id);
    try {
        await waitForNodeStart(baseSimulationObject._id);
    } catch (error) {
        await pushLog(baseSimulationObject._id, "start-error", `${error}`, 4);
        await delete_([jobObject, serviceObject, routeObject, dashboardRouteObject], tmpWorkdir, baseSimulationObject._id);
        throw error;
    }
    return { host, dashboardHost };
}

module.exports = startSimNode;
