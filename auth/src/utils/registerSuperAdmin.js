// This function is called upon server start

'use strict';

const argon2 = require('argon2');

const argon2_options = require('../config').argon2_options;
const db = require('../db');


module.exports = async function() {
    const superAdminUsername = process.env.ADMIN_USERNAME;
    const superAdminPassword = process.env.ADMIN_PASSWORD;
    const superAdminEmail = process.env.ADMIN_EMAIL;
    
    const superAdminsFound = await db.query('SELECT * FROM users WHERE username = $1', [superAdminUsername]);
    if (superAdminsFound.rows.length > 0) {
        console.log('Super admin already exists. No action required.');
        return;
    }

    const superAdminPasswordHash = await argon2.hash(superAdminPassword, argon2_options);

    await db.query(
        'INSERT INTO users(username, email, password_hash, type) VALUES($1, $2, $3, $4)',
        [superAdminUsername, superAdminEmail, superAdminPasswordHash, 'admin']
    );
    console.log('Super admin created.');
}
