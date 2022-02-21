'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/check_access', async function(request, response) {
    const { token, projectId } = request.body;

    // Find device
    const device = await devicesCollection().findOne({ token });
    if (!device) {
        response.status(StatusCodes.NOT_FOUND).send('No device with such token.');
        return;
    }

    // Check project id
    if (projectId !== device.project) {
        response.status(StatusCodes.UNAUTHORIZED).send('Device is not allowed to access the project.');
        return;
    }

    // Verify
    response.sendStatus(StatusCodes.OK);
});

module.exports = router;
