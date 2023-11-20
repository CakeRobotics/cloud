'use strict'

const db = require('../db');

module.exports = async function() {
    while (true) {
        try {
            const connection = await db.pool.connect();
            connection.release();
            break;
        } catch (error) {
            console.log(error);
            console.log('Retrying in 1 sec...');
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}
