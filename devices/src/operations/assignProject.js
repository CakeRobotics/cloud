'use strict';

const crypto = require('crypto');

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { getSocket } = require('../socket/sockets');
const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/:owner/:name/assign_project', async function(request, response) {
    const { owner, name } = request.params;
    const { project } = request.body;
    if (response.locals.user.username !== owner) {
        response.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }
    const _id = `${owner}/${name}`;
    
    // Assert device exists
    const device = await devicesCollection().findOne({ _id });
    if (!device) {
        response.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    // Update device information
    await devicesCollection().updateOne({ _id }, {
        $set: {
            project,
        }
    });

    // Restart device
    if (device.online) {
        const socket = getSocket(device.socketId);
        console.info(`Restarting device ${_id}`);
        socket.emit('restart');
    }

    // Finish
    response.sendStatus(StatusCodes.OK);
});

module.exports = router;
