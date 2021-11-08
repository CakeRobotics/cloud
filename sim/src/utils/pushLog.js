const { simulationsCollection } = require('../db');
const { ObjectId } = require('mongodb');

const pushLog = async (simulationId, group, message, level=0, hidden=false) => {
    if (!simulationsCollection()) {
        // DB not ready but no worries---this is just log. (Probably running tests)
        console.log(`[${group}] ${message}`);
        return;
    } else if (process.env.NODE_ENV === 'test') {
        console.log(`[${group}] ${message}`);
    }
    if (hidden) {
        console.log(`[${simulationId.toString().slice(20)} ${group}] ${message}`);
    }
    const _id = new ObjectId(simulationId);
    await simulationsCollection().updateOne(
        { _id },
        {
            $push: {
                logs: {
                    time: new Date(),
                    group,
                    level,
                    message,
                    hidden,
                }
            }
        }
    );
}

module.exports = pushLog;
