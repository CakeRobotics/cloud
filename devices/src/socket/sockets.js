var sockets = {};

const getSocket = (socketId) => {
    return sockets[socketId];
}

const storeSocket = (socketId, client) => {
    sockets[socketId] = client;
}

module.exports = { getSocket, storeSocket };
