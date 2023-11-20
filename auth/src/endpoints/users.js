'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const db = require('../db');
const requireAdmin = require('../utils/requireAdmin');

const router = express.Router();
router.use(express.json());

router.get(
    '/users/:username',
    requireAdmin(
        async function(request, response) {
            const username = request.params.username;

            // Get user
            const foundUsers = await db.query('SELECT username, email, type FROM users WHERE username=$1', [username]);
            if (foundUsers.rows.length === 0) {
                response.status(StatusCodes.NOT_FOUND).send('User not found.');
                return;
            }

            // Return user info
            response.send(foundUsers.rows[0]);
        }
    )
);

module.exports = router;
