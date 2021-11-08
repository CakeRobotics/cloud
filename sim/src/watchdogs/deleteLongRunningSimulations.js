const { simulationsCollection } = require('../db');
const stopSimulation_pipeline = require('../pipeline/stopSimulation_pipeline');
const pushLog = require('../utils/pushLog');

const deleteLongRunningSimulations = async () => {
    const maxRunDuration = 60 * 60_000;
    const nowTimestamp = (new Date()).getTime();
    const oldestStartTimeAllowed = new Date(nowTimestamp - maxRunDuration);
    const query = {
        state: {
            $in: ['up', 'reloading']
        },
        startTime: {
            $lt: oldestStartTimeAllowed,
        }
    }
    const oldSimulations = await simulationsCollection().find(query);
    const oldSimulationsArray =  await oldSimulations.toArray();
    for (const { _id } of oldSimulationsArray) {
        const message = `WATCHDOG-deleteLongRunningSimulations is stopping sim-${_id}`;
        console.log(message);
        pushLog(_id, "watchdog", message, 4);
        await simulationsCollection().updateOne(
            { _id },
            {
                $set: {
                    state: "stopped-watchdog",
                    endTime: new Date(),
                }
            }
        );
        try {
            await stopSimulation_pipeline(_id);
        } catch (error) {
            console.log(`WATCHDOG Failed to delete sim-${_id} but this might be fine. Failure reason: """${error}"""`);
        }
    }
}

module.exports = deleteLongRunningSimulations;
