'use strict';

const crypto = require('crypto');
const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const db = require('../db');
const requireAdmin = require('../utils/requireAdmin');

const router = express.Router();
router.use(express.json());

router.post(
    '/createRegistrationToken',
    requireAdmin(
        async function(request, response) {
            const email = request.body.email;

            // Return old token if already exists
            const foundTokens = await db.query('SELECT token FROM registration_tokens WHERE email=$1', [email]);
            if (foundTokens.rows.length > 0) {
                response.send(foundTokens.rows[0].token);
                return;
            }

            // Generate new token
            const token = crypto.randomBytes(12).toString('base64');

            // Add to DB
            await db.query('INSERT INTO registration_tokens(token, email) VALUES($1, $2)', [token, email]);

            // Return the new token
            response.send(token);
        }
    )
);

module.exports = router;
