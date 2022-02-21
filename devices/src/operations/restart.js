'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { getSocket } = require('../socket/sockets');
const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/:owner/:name/restart', async function(request, response) {
    const { owner, name } = request.params;
    if (response.locals.user.username !== owner) {
        response.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }
    const _id = `${owner}/${name}`;

    const device = await devicesCollection().findOne({ _id });
    if (!device) {
        response.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }
    if (!device.online) {
        response.status(StatusCodes.BAD_REQUEST).send("Device is offline.");
        return;
    }
    const socket = getSocket(device.socketId);
    console.info(`Restarting device ${_id}`)
    socket.emit('restart');
    response.sendStatus(200);
});

module.exports = router;
