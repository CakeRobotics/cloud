'use strict';

const crypto = require('crypto');

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { getSocket } = require('../socket/sockets');
const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/assign_project', async function(request, response) {
    for (const { owner, name } of request.body.devices) {
        const _id = `${owner}/${name}`;
        // Assert correct access
        if (response.locals.user.type !== 'admin' && response.locals.user.username !== owner) {
            response.sendStatus(StatusCodes.UNAUTHORIZED).send(`Access denied to ${_id}.`);
            return;
        }
        // Assert device exists
        const device = await devicesCollection().findOne({ _id });
        if (!device) {
            response.sendStatus(StatusCodes.NOT_FOUND).send(`Device ${_id} not found.`);
            return;
        }
    }

    // Set project
    const { project } = request.body;
    for (const { owner, name } of request.body.devices) {
        // Unset other devices were linked to this project
        const { unsetOthers } = request.body;
        if (unsetOthers) {
            await devicesCollection().updateOne({ project }, {
                $set: {
                    project: '',
                }
            });
        }
        const _id = `${owner}/${name}`;
        // Update device information
        await devicesCollection().updateOne({ _id }, {
            $set: {
                project,
            }
        });
        // Restart device
        const { online } = await devicesCollection().findOne({ _id });
        if (online) {
            const socket = getSocket(device.socketId);
            console.info(`Restarting device ${_id}`);
            socket.emit('restart');
        }
    }

    // Finish
    response.sendStatus(StatusCodes.OK);
});

module.exports = router;
