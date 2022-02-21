const { getSocket, storeSocket } = require('./sockets');
const { devicesCollection } = require('../db');

const onEstablish = async (client, data) => {
    const ip = client.handshake.headers['x-real-ip'] || client.request.connection.remoteAddress;
    const { id, token } = data;
    if (!id) {
        client.emit('error', "'id' field is mandatory.");
        return;
    }
    if (!token) {
        client.emit('error', "'token' field is mandatory.");
        return;
    }

    const device = await devicesCollection().findOne({ _id: id });
    if (!device) {
        client.emit('error', "Device is not registered.");
        return;
    }

    if (token !== device.token) {
        client.emit('error', "Token doesn't match.");
        return;
    }

    // Update device in db
    await devicesCollection().updateOne({ _id: id }, {
        $set: {
            online: true,
            socketId: client.id,
            ip: ip,
        }
    })

    // Store socket
    if (getSocket(client.id)) {
        getSocket(client.id).close();
    }
    storeSocket(client.id, client);

    console.info(`Device ${id} established.`)
    client.emit('establish_ok');
}

module.exports = onEstablish;
