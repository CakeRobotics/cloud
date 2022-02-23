const { getSocket, storeSocket } = require('./sockets');
const { devicesCollection } = require('../db');

const registerSocket = async (client) => {
    const ip = client.handshake.headers['x-real-ip'] || client.request.connection.remoteAddress;
    const { token } = client.handshake.auth;
    if (!token) {
        throw "socketio's auth.token is mandatory.";
    }

    const device = await devicesCollection().findOne({ token });
    if (!device) {
        throw "No device with such token.";
    }

    // Update device in db
    await devicesCollection().updateOne({ token }, {
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

    return device.id;
}

module.exports = registerSocket;
