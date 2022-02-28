'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { getSocket } = require('../socket/sockets');
const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/restart', async function(request, response) {
    // Assertions
    for (const { owner, name } of request.body.devices) {
        const _id = `${owner}/${name}`;
        if (response.locals.user.type !== 'admin' && response.locals.user.username !== owner) {
            response.status(StatusCodes.UNAUTHORIZED).send(`Device ${_id} is unauthorized.`);
            return;
        }
        const device = await devicesCollection().findOne({ _id });
        if (!device) {
            response.status(StatusCodes.NOT_FOUND).send(`Device ${_id} was not found.`);
            return;
        }
    }
    // Restart
    for (const { owner, name } of request.body.devices) {
        const _id = `${owner}/${name}`;
        const device = await devicesCollection().findOne({ _id });
        const socket = getSocket(device.socketId);
        if (socket) {
            console.info(`Restarting device ${_id}`)
            socket.emit('restart');
        }
    }
    response.sendStatus(200);
});

module.exports = router;
