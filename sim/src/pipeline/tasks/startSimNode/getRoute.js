const getFreeDomain = require("../../../utils/getFreeDomain");

const getRoute = async (simulationObject) => {
    const simulationId = simulationObject._id;
    const host = await getFreeDomain();
    const routeObject = {
        "apiVersion": "route.openshift.io/v1",
        "kind": "Route",
        "metadata": {
            "name": `sim-${simulationId}`
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
                "targetPort": "http"
            }
        }
    };
    return { host, routeObject };
}

module.exports = getRoute;
