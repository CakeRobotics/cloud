'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.put('/:owner/:name', async function(request, response) {
    const { owner, name } = request.params;
    const { user } = response.locals;

    if (user.type !== 'admin' && user.username !== owner) {
        response.status(StatusCodes.UNAUTHORIZED);
        response.send("Only admins can modify other users' devices.");
        return;
    }
    var device = await devicesCollection().findOne({ owner, name });
    if (!device) {
        response.status(StatusCodes.NOT_FOUND).send();
        return;
    }
    device.name = request.body.name || device.name;
    device.project = request.body.project || device.project;
    await devicesCollection().updateOne({ owner, name }, { $set: {
        ...device
    }});

    response.sendStatus(StatusCodes.OK);
});

module.exports = router;
