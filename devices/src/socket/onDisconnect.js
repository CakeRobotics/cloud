const { devicesCollection } = require('../db');
const { storeSocket } = require('./sockets');

const onDisconnect = async (client) => {
    await devicesCollection().updateOne({ socketId: client.id }, {
        $set: {
            online: false,
            socketId: '',
            ip: '',
        }
    })
    storeSocket(client.id, undefined);
    console.debug(`Socket ${client.id} disconnected.`);
}

module.exports = onDisconnect;
