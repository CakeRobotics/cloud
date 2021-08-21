'use strict';

const db = require('./db');

module.exports = async function() {
    while (true) {
        try {
            await db.authenticate();
            // db.close();
            break;
        } catch (error) {
            console.log(error);
            console.log('Retrying in 1 sec...');
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}
