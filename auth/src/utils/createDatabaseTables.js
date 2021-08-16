// This function is called upon server start

'use strict';

const db = require('../db');

module.exports = async function() {
    await db.query(
        `CREATE TABLE IF NOT EXISTS users
        (
            id SERIAL,
            username VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(300) NOT NULL,
            type TEXT DEFAULT 'normal' CHECK (type IN ('admin', 'normal')),
            last_access TIMESTAMP,
            date_of_creation TIMESTAMP DEFAULT current_timestamp,
            PRIMARY KEY (id)
        );`
    );

    await db.query(
        `CREATE TABLE IF NOT EXISTS registration_tokens
        (
            token TEXT NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            date_of_creation TIMESTAMP DEFAULT current_timestamp
        );`
    );
}