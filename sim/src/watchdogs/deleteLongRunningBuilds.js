const { simulationsCollection } = require('../db');
const pushLog = require('../utils/pushLog');

const deleteLongRunningBuilds = async () => {
    const maxRunDuration = 20 * 60_000;
    const nowTimestamp = (new Date()).getTime();
    const oldestStartTimeAllowed = new Date(nowTimestamp - maxRunDuration);
    const query = {
        state: 'starting',
        creationDate: {
            $lt: oldestStartTimeAllowed,
        }
    }
    const oldBuilds = await simulationsCollection().find(query);
    const oldBuildsArray =  await oldBuilds.toArray();
    for (const { _id } of oldBuildsArray) {
        const message = `WATCHDOG-deleteLongRunningBuilds is stopping sim-${_id}`;
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
        // "deleteOrphanResources" takes care of residuals
    }
}

module.exports = deleteLongRunningBuilds;
