'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const StatusCodes = require('http-status-codes').StatusCodes;

const db = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/validate', async function(request, response) {
    const token = request.body.token;

    // Decrypt JWT
    try {
        var info = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        response.status(StatusCodes.NOT_ACCEPTABLE).send('Bad JWT');
        return;
    }

    // Get user
    const username = info.username;
    const foundUsers = await db.query('SELECT username, email, type FROM users WHERE username=$1', [username]);
    if (foundUsers.rows.length === 0) {
        response.status(StatusCodes.NOT_ACCEPTABLE).send('Username encoded in the JWT has changed or deleted.');
        return;
    }

    response.send(foundUsers.rows[0]);
});

module.exports = router;
