const { REGISTRY_INTERNAL_ADRESS, OC_PROJECT, DEFINE_RESOURCES } = require("../../../config");
const apply = require("../../../utils/openshift/apply");

const createBuildConfig = async (simulationObject, userCodeDir) => {
    const simulationId = simulationObject._id;
    const buildConfigName = `sim-${simulationId}-user-code`;
    const dockerImageName = `${REGISTRY_INTERNAL_ADRESS}/${OC_PROJECT}/sim-${simulationId}-user-code`;
    const buildConfigResources = DEFINE_RESOURCES && {
        "resources": {
            "limits": {
                "cpu": "4",
                "ephemeral-storage": "2G",
                "memory": "8G",
            },
            "requests": {
                "cpu": "4",
                "ephemeral-storage": "2G",
                "memory": "8G",
            },
        }
    }
    buildConfigObject = {
        kind: "BuildConfig",
        apiVersion: "build.openshift.io/v1",
        metadata: {
            name: buildConfigName,
        },
        spec: {
            runPolicy: "Serial",
            source: {
                type: "Binary",
            },
            strategy: {
                dockerStrategy: {
                    from: {
                        kind: "DockerImage",
                        name: "ros:galactic-ros-base-focal",
                    },
                },
            },
            output: {
                to: {
                    kind: "DockerImage",
                    name: dockerImageName,
                },
            },
            ...buildConfigResources,
        },
    };
    await apply([buildConfigObject], userCodeDir, simulationId);
    return { buildConfigName, dockerImageName, buildConfigObject }
}

module.exports = createBuildConfig;
