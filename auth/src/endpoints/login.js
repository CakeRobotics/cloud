'use strict';

const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const StatusCodes = require('http-status-codes').StatusCodes;

const db = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/login', async function(request, response) {
    // SECURITY NODE: Vulrunable to brute force. Possible rate limiting fix: https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection

    const username_or_email = request.body.username_or_email;
    const password = request.body.password;

    // SECURITY NOTE: Timing attack can be used to determine username/email existance
    // Get user
    const foundUsers = await db.query('SELECT * FROM users WHERE username=$1 OR email=$1', [username_or_email]);
    if (foundUsers.rows.length === 0) {
        response.status(StatusCodes.UNAUTHORIZED).send('Wrong username or password.');
        console.log(`Failed attempt to login as '${username_or_email}' from ${request.headers['x-real-ip'] || request.ip}.`);
        return;
    }

    // Validate password
    if (!await argon2.verify(foundUsers.rows[0].password_hash, password)) {
        response.status(StatusCodes.UNAUTHORIZED).send('Wrong username or password.');
        console.log(`Failed attempt to login as '${username_or_email}' from ${request.headers['x-real-ip'] || request.ip}.`);
        return;
    }

    // TODO: Update last login / last access

    // Generate token
    const token = jwt.sign(
        {
            username: foundUsers.rows[0].username,
            email: foundUsers.rows[0].email
        },
        process.env.JWT_SECRET
    );

    // Return token
    console.log(`Successful login as '${username_or_email}' from ${request.headers['x-real-ip'] || request.ip}.`);
    response.send(token);
});

module.exports = router;
