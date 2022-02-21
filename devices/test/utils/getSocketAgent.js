const Client = require("socket.io-client");
const { waitForEvent } = require('./socket');

const getSocketAgent = async () => {
    const socket = new Client(`http://localhost:9000`);
    await waitForEvent(socket, "connect");
    return socket;
}

module.exports = getSocketAgent;
