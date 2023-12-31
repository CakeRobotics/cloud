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
                }
            ]
        }
    }
    return serviceObject;
}

module.exports = getService;
