const socketService = require('socket.io')();

const onEstablish = require('./onEstablish');
const onDisconnect = require('./onDisconnect');

socketService.on('connection', client => {
    console.debug(`Socket ${client.id} created.`)

    client.on('establish', async (data) => {
        await onEstablish(client, data)

        client.once('disconnect', async () => {
            await onDisconnect(client);
        });
    });
});

module.exports = {
    socketService,
};
