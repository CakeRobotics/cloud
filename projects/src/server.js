'use strict';

const app = require('./server_app');
const init = require('./server_init');

const initPromise = init();

const port = 8000;
const server = app.listen(port, async function() {
    await initPromise;
    console.log(`Projects service started on port ${port}`);
});

module.exports = {
    server, ready: initPromise
}
