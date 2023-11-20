const Client = require("socket.io-client");
const { waitForEvent } = require('./socket');

const getSocketAgent = async ({ token }) => {
    const socket = new Client(`http://localhost:9000`, { auth: { token } });
    await waitForEvent(socket, "connect");
    return socket;
}

module.exports = getSocketAgent;
