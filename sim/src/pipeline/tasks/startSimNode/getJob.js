const { DEFINE_RESOURCES, SIM_IMAGE, CRL_DEV_IMAGE } = require('../../../config');

const getJob = async (simulationObject, authHeader) => {
    const simulationId = simulationObject._id;
    const jobName = `sim-${simulationId}`;
    const simResources = DEFINE_RESOURCES && {
        "resources": {
            "limits": {
                "cpu": "4",
                "ephemeral-storage": "2G",
                "memory": "4G",
            },
            "requests": {
                "cpu": "4",
                "ephemeral-storage": "2G",
                "memory": "4G",
            },
        }
    }
    const userCodeResources = DEFINE_RESOURCES && {
        "resources": {
            "limits": {
                "cpu": "1",
                "ephemeral-storage": "2G",
                "memory": "2G",
            },
            "requests": {
                "cpu": "1",
                "ephemeral-storage": "2G",
                "memory": "2G",
            },
        }
    }
    const jobObject = {
        "apiVersion": "batch/v1",
        "kind": "Job",
        "metadata": {
            "name": jobName,
        },
        "spec": {
            "template": {
                "metadata": {
                    "labels": {
                        "app": `sim-${simulationId}`
                    }
                },
                "spec": {
                    "restartPolicy": "Never",
                    "containers": [
                        {
                            "name": "sim",
                            "image": SIM_IMAGE,
                            "imagePullPolicy": "Always",
                            "ports": [
                                {
                                    "containerPort": 8080
                                }
                            ],
                            "securityContext": {
                                "runAsUser": 1000,
                                "runAsGroup": 3000,
                                "fsGroup": 2000
                            },
                            "readinessProbe": {
                                "httpGet": {
                                    "path": "/",
                                    "port": 8080,
                                },
                                "failureThreshold": 12,
                                "periodSeconds": 5,
                            },
                            ...simResources,
                            "env": [
                                { "name": "WORLD", "value": simulationObject.world || "" },
                                { "name": "ROBOT", "value": simulationObject.projectFiles.props.sim_robot || "" },
                            ],
                        },
                        {
                            "name": "user-code",
                            "image": CRL_DEV_IMAGE,
                            "imagePullPolicy": "Always",
                            "securityContext": {
                                "runAsUser": 0,
                                "runAsGroup": 0,
                                "fsGroup": 0
                            },
                            env: [
                                {
                                    name: 'PROJECT_URL',
                                    value: simulationObject.projectUrlPublic,
                                },
                                {
                                    name: 'AUTH_HEADER',
                                    value: authHeader,
                                },
                            ],
                            "command": ["/bin/bash", "-c", "--"],
                            "args": [
                                `source /ros_entrypoint.sh
                                cd /app
                                mkfifo /app/stdout
                                bash -c "python3 -u /crl/docker/dev/controller.py > /app/stdout 2>&1 ; echo Robot application closed with exit code $? > /app/stdout" &
                                bash -c "while true; do sleep 80; echo __KEEPALIVE__ > /app/stdout; done;" &
                                while true; do cat /app/stdout; done;`
                            ], // Reason: if a container within the pod closes, kubernetes stops routing to that pod.
                            ...userCodeResources,
                        }
                    ]
                }
            }
        }
    };
    return jobObject;
}

module.exports = getJob;
