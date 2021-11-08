const { OC_CMD, OC_FIXED_ARGS } = require("../config");
const get = require("../utils/openshift/get");
const pushLog = require("../utils/pushLog");
const spawnWithLogs = require('../utils/spawnWithLogs');
const storeUserCodeInTempDir = require("./tasks/buildAppImage/storeUserCodeInTempDir");

const hotReload_pipeline = async (newSimulationObject) => {
    const simulationId = newSimulationObject._id;

    // Push logs
    await pushLog(simulationId, 'hot-reload', 'Reloading...');

    // Store new code
    const appPath = await storeUserCodeInTempDir(newSimulationObject);

    // Find pod name
    const [ pod ] = await get(['pods', '-l', `app=sim-${simulationId}`]);

    // Push new code
    // SECURITY NOTE: Kubernetes deployment files will be copied to user code container!
    const copyPromise = spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'rsync', `${appPath}/`, `pods/${pod.name}:/app`, '-c', 'user-code'],
        spawnOptions: { timeout: 60_000 },
        simulationId,
        logGroup: 'hot-reload',
    });

    // Kill the existing python instance if any
    const pythonKillPromise = spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'exec', `pods/${pod.name}`, '-c', 'user-code', '--',
            'bash', '-c', 'pkill -9 python || true'],
        spawnOptions: { timeout: 60_000 },
        simulationId,
        logGroup: 'hot-reload',
    });

    await copyPromise;
    await pythonKillPromise;

    // Spawn new python process
    // bash -c "(python3 -u /app/main.py > /app/stdout 2>&1) ; (echo Robot application closed with exit code $? > /app/stdout)" &
    const runUserCodePromise = spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'exec', `pods/${pod.name}`, '-c', 'user-code', '--',
            'nohup', '/bin/bash', '-c',
            `source /ros_entrypoint.sh
            python3 -u /app/main.py > /app/stdout 2>&1 &
            exit`
        ],
        spawnOptions: { timeout: 60_000 },
        simulationId,
        logGroup: 'hot-reload',
    });

    // Restart gazebo
    const restartGazeboPromise = spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'exec', `pods/${pod.name}`, '-c', 'sim', '--',
            '/bin/bash', '-c',
            `source /ros_entrypoint.sh
            ros2 service call /pause_physics std_srvs/srv/Empty
            ros2 service call /reset_simulation std_srvs/srv/Empty
            `
        ],
        spawnOptions: { timeout: 60_000 },
        simulationId,
        logGroup: 'hot-reload',
    });

    await runUserCodePromise;
    await restartGazeboPromise;
}

module.exports = hotReload_pipeline;
