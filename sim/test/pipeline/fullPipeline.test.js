// Extensive end-to-end test
// only runs if TEST_FULL=1
// Manual clean up command: (DON'T RUN ON PRODUCTION CLUSTER!)
// oc get jobs | grep -Po "^sim-\w+" | xargs -I% oc delete jobs/%
// oc get services | grep -Po "^sim-\w+" | xargs -I% oc delete svc/%
// oc get routes | grep -Po "^sim-\w+" | xargs -I% oc delete route/%

const { spawnSync } = require('child_process');
const { OC_CMD, OC_FIXED_ARGS } = require('../../src/config');
const { simulationsCollection, initDatabaseConnection, closeDatabaseConnection } = require('../../src/db');
const startSimulation_pipeline = require("../../src/pipeline/startSimulation_pipeline");
const stopSimulation_pipeline = require("../../src/pipeline/stopSimulation_pipeline");
const get = require("../../src/utils/openshift/get");

test('fullPipeline', async function() {
    if (process.env.TEST_FULL !== '1') {
        console.info('Skipping runPipeline test as env.TEST_FULL is not set to 1.')
        return;
    }
    const simulationObject = {
        projectFiles: {
            props: {},
            mainfile: "print('TEST_LOG')",
            state: "starting"
        },
        world: "/usr/share/gazebo-11/worlds/cafe.world",
    }

    await initDatabaseConnection();
    await simulationsCollection().insertOne(simulationObject);

    // START
    const routesBefore = await get('routes')
    const simulationHostname = await startSimulation_pipeline(simulationObject);
    const routesAfter = await get('routes')

    expect(routesAfter.length).toEqual(routesBefore.length + 1);
    expect(routesBefore.filter(r => r['host/port'] === simulationHostname).length).toEqual(0);
    expect(routesAfter.filter(r => r['host/port'] === simulationHostname).length).toEqual(1);

    const pods = await get('pods');
    const matchedPod = pods.find(pod => pod.name.match(`sim-${simulationObject._id}`));
    expect(matchedPod).toBeTruthy();

    const routes = await get('routes');
    const matchedRoute = routes.find(route => route.name.match(`sim-${simulationObject._id}`));
    expect(matchedRoute).toBeTruthy();

    await new Promise(r => setTimeout(r, 5000));

    const userCodeLogs = spawnSync(OC_CMD, [...OC_FIXED_ARGS, 'logs', `pods/${matchedPod.name}`, 'user-code']).stdout.toString();
    expect(userCodeLogs).toMatch('TEST_LOG');

    // STOP
    // await stopSimulation_pipeline(simulationObject._id);

    // const podsAfterStop = await get('pods');
    // const matchedPodAfterStop = podsAfterStop.find(pod => pod.name.match(`sim-${simulationObject._id}`));
    // const isStillRunning = matchedPodAfterStop && matchedPodAfterStop.status === 'Running';
    // expect(isStillRunning).toBeFalsy();

    // const routesAfterStop = await get('routes');
    // const matchedRouteAfterStop = routesAfterStop.find(route => route.name.match(`sim-${simulationObject._id}`));
    // expect(matchedRouteAfterStop).toBeFalsy();

    await closeDatabaseConnection();
}, 10 * 60 * 1000)
