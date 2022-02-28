const { devicesCollection } = require('../db');

const pushLog = async ({ deviceQuery, message, system=false }) => {
    if (!devicesCollection()) {
        // DB not ready but no worries---this is just log. (Probably running tests)
        console.log(message);
        return;
    } else if (process.env.NODE_ENV === 'test') {
        console.log(message);
    }
    if (system) {
        console.log(`[${deviceQuery}] ${message}`);
    }
    await devicesCollection().updateOne(
        deviceQuery,
        {
            $push: {
                logs: {
                    time: new Date(),
                    message,
                    system,
                }
            }
        }
    );
}

module.exports = pushLog;
