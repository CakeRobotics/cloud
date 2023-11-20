'use strict';

const expressService = require('./http/expressService');
const { socketService } = require('./socket/socketService');
const init = require('./init');

const initPromise = init();

const expressPort = 8000;
const server = expressService.listen(expressPort, () => {
    console.log(`Devices service started on port ${expressPort}.`);
});
const socketPort = 9000;
socketService.listen(socketPort);

module.exports = {
    server, ready: initPromise
}