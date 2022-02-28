'use strict';

const crypto = require('crypto');

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { MongoError } = require('mongodb')

const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.get('/src/:filename', async function(request, response) {
    const { filename } = request.params;
    try {
        const authorizationHeader = request.headers.authorization;
        var token = (/Device (.+)/).exec(authorizationHeader)[1];
    } catch (error) {
        response.status(StatusCodes.UNAUTHORIZED).send('This action requires auth token.');
        return;
    }

    // Find device
    const device = await devicesCollection().findOne({ token });
    if (!device) {
        response.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    // Redirect
    const { project } = device;
    if (project.match(/http.+/)) {
        response.redirect(`${project}/${filename}`);
    } else {
        response.redirect(`https://cloud.cakerobotics.com/api/projects/${project}/${filename}`);
    }
});

module.exports = router;
