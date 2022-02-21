const waitForEvent = (socket, eventName) => {
    return new Promise((resolve, reject) => {
        socket.on(eventName, data => resolve(data));
        socket.on('error', data => reject(data));
    })
}

module.exports = {
    waitForEvent,
}
