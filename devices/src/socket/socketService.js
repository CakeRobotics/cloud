const socketService = require('socket.io')({ path: '/' });

const registerSocket = require('./registerSocket');
const onDisconnect = require('./onDisconnect');

socketService.on('connection', async client => {
    try {
        const deviceId = await registerSocket(client);
        client.once('disconnect', () => { onDisconnect(client) });
        console.log(`Socket ${client.id} registered for device ${deviceId}.`);
        client.emit('accept');
    } catch (exception) {
        client.emit('error', exception);
        console.log(`Socket ${client.id} rejected due to error: "${exception}".`);
        client.disconnect();
    }
});

module.exports = {
    socketService,
};
