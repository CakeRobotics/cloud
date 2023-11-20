'use strict';

const argon2 = require('argon2');
const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const argon2_options = require('../config').argon2_options;
const db = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/register', async function(request, response) {
    // TODO: Add captcha or email verification before public release

    const username = request.body.username;
    const password = request.body.password;
    const email = request.body.email;

    // Check type (admin/normal)
    const type = request.body.type || 'normal';
    if (!type.match(/^admin|normal$/g)) {
        response.status(StatusCodes.BAD_REQUEST).send('Type must be "normal" or "admin".');
        return;
    }
    if (type === 'admin') {
        // Verify authorization
        // TODO: Implement with token check so that only admins can create admins
        response.sendStatus(StatusCodes.NOT_IMPLEMENTED);
        return;
    }

    // Validate registration token
    if (process.env.REQUIRE_REGISTERATION_TOKEN === '1' && type !== 'admin') {
        const registrationToken = request.body.registrationToken;
        const foundTokens = await db.query(
            'SELECT * FROM registration_tokens WHERE token=$1 AND email=$2',
            [registrationToken, email]
        );
        if (foundTokens.rows.length === 0) {
            response.status(StatusCodes.NOT_ACCEPTABLE).send('Invalid token-email pair.');
            return;
        }
    }

    // Validate username
    if (!username.match(/^[a-zA-Z0-9\-]{3,40}$/g)) {
        response.status(StatusCodes.BAD_REQUEST).send('Username must only contain 3-40 alphanumericals and hyphens.');
        return;
    }

    // Validate password
    if (!password.match(/^.{6,}$/g)) {
        response.status(StatusCodes.BAD_REQUEST).send('Password must be at least 6 characters long.');
        return;
    }

    // Validate email
    if (!email.match(/^\S+@\S+\.\S+$/g)) {
        response.status(StatusCodes.BAD_REQUEST).send('Bad email format.');
        return;
    }

    // Check for duplicates
    // SECURITY NOTE: Can this be abused to discover registered users?
    const foundUsernameDuplicates = await db.query('SELECT * FROM users WHERE username=$1', [username]);
    if (foundUsernameDuplicates.rows.length > 0) {
        response.status(StatusCodes.CONFLICT).send('Username already exists.');
        return;
    }
    const foundEmailDuplicates = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    if (foundEmailDuplicates.rows.length > 0) {
        response.status(StatusCodes.CONFLICT).send('Email already exists.');
        return;
    }

    // TODO: Implement rollback
    const password_hash = await argon2.hash(password, argon2_options);
    await db.query(
        'INSERT INTO users(username, email, password_hash, type) values($1, $2, $3, $4)',
        [username, email, password_hash, type]
    );
    console.log(`New user '${username}' was registered.`);

    response.status(StatusCodes.CREATED).send('User was registered.');
});

module.exports = router;
