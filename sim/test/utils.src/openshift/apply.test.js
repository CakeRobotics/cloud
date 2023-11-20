const { DEFINE_RESOURCES } = require("../../../src/config");
const apply = require("../../../src/utils/openshift/apply");
const delete_ = require("../../../src/utils/openshift/delete_");
const get = require("../../../src/utils/openshift/get");
const randomString = require("../../utils/randomString");

test('apply', async function() {
    const bcName = `test-bc-${randomString()}`;
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
    };
    const bc = {
        kind: "BuildConfig",
        apiVersion: "build.openshift.io/v1",
        metadata: {
            name: bcName,
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
                    name: "172.30.1.1:5000/myproject/sim-1:latest",
                },
            },
            ...buildConfigResources,
        }
    };

    await apply([bc], '/tmp');
    var bcs = await get('bc');
    var matches = bcs.filter(item => item.name === bcName);
    expect(matches.length).toEqual(1);

    await delete_([bc], '/tmp');
    bcs = await get('bc');
    matches = bcs.filter(item => item.name === bcName);
    expect(matches.length).toEqual(0);
})
