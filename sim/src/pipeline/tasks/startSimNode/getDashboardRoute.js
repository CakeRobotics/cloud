const getFreeDashboardDomain = require("../../../utils/getFreeDashboardDomain");

const getDashboardRoute = async (simulationObject) => {
    const simulationId = simulationObject._id;
    const host = await getFreeDashboardDomain();
    const routeObject = {
        "apiVersion": "route.openshift.io/v1",
        "kind": "Route",
        "metadata": {
            "name": `sim-${simulationId}-dash`
        },
        "spec": {
            "host": host,
            "to": {
                "kind": "Service",
                "name": `sim-${simulationId}`
            },
            "tls": {
                "termination": "edge",
                "insecureEdgeTerminationPolicy": "Allow"
            },
            "port": {
                "targetPort": "http-dash"
            }
        }
    };
    return { host, routeObject };
}

module.exports = getDashboardRoute;
