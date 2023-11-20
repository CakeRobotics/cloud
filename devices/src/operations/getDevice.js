'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.get('/:owner/:name', async function(request, response) {
    const { owner, name } = request.params;
    const { user } = response.locals;

    if (user.type !== 'admin' && user.username !== owner) {
        response.status(StatusCodes.UNAUTHORIZED);
        response.send("Only admins can query other users' devices.");
        return;
    }
    const device = await devicesCollection().findOne({ owner, name });
    if (!device) {
        response.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    const result = {
        ip: device.ip,
        logs: device.logs,
        name: device.name,
        online: device.online,
        owner: device.owner,
        project: device.project,
        sim: device.sim,
        token: device.token,
    };
    response.send(result);
});

module.exports = router;
