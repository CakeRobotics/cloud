const pushLog = require('../utils/pushLog');

const onLog = async (client, message) => {
    await pushLog({
        deviceQuery: { socketId: client.id },
        message,
        system: false,
    });
}

module.exports = onLog;
