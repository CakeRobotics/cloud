const getService = async (simulationObject) => {
    const simulationId = simulationObject._id;
    const serviceObject = {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
            "name": `sim-${simulationId}`
        },
        "spec": {
            "selector": {
                "app": `sim-${simulationId}`
            },
            "ports": [
                {
                    "name": "http",
                    "protocol": "TCP",
                    "port": 80,
                    "targetPort": 8080
                }, {
                    "name": "http-dash",
                    "protocol": "TCP",
                    "port": 8888,
                    "targetPort": 8888
                }
            ]
        }
    }
    return serviceObject;
}

module.exports = getService;
