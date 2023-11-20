const { spawn } = require('child_process');
const { ObjectId } = require('mongodb');
const { OC_CMD, OC_FIXED_ARGS } = require('../config');
const { simulationsCollection } = require('../db');
const get = require('../utils/openshift/get');

const simIdFromResourceName = (name) => ObjectId(name.match(/sim-([a-z0-9]+)/)[1]);

// Deletes all the jobs, svcs, routes and builds that don't have a corrensponding active simulation.
const deleteDanglingResources = async () => {
    const criteria = [
        { resourceType: 'jobs', expectedStates: ['starting', 'up', 'reloading'] },
        { resourceType: 'services', expectedStates: ['starting', 'up', 'reloading'] },
        { resourceType: 'routes', expectedStates: ['starting', 'up', 'reloading'] },
        { resourceType: 'builds', expectedStates: ['starting'] },
    ]

    var resourcesToDelete = [];
    for ({ resourceType, expectedStates } of criteria) {
        const activeResources = await get(resourceType);
        for (const resource of activeResources) {
            const _id = simIdFromResourceName(resource.name);
            const simulation = await simulationsCollection().findOne({ _id });
            const isUpright = simulation && expectedStates.filter(state => state === simulation.state).length;
            if (!isUpright) {
                resourcesToDelete.push(`${resourceType}/${resource.name}`);
            }
        }
    }

    if (resourcesToDelete.length === 0) {
        return;
    }

    console.log(`WATCHDOG-deleteDanglingResources is deleting [${resourcesToDelete}]`);
    return new Promise((resolve, reject) => {
        const process = spawn(
            OC_CMD,
            [...OC_FIXED_ARGS, 'delete', ...resourcesToDelete],
            { timeout: 120_000 }
        );
        process.on("close", (exitCode) => {
            if (exitCode == 0) {
                resolve();
            } else {
                const errorMessage = `Command 'oc delete ...' failed with exit code ${exitCode}.`;
                reject(errorMessage);
            }
        });
        process.stdout.on("data", (data) => {
            console.log(data.toString());
        });
        process.stderr.on("data", (data) => {
            console.error(data.toString());
        })
    });
}

module.exports = deleteDanglingResources;
