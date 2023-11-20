'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.delete('/:owner/:name', async function(request, response) {
    const { owner, name } = request.params;
    const { user } = response.locals;

    if (user.type !== 'admin' && user.username !== owner) {
        response.status(StatusCodes.UNAUTHORIZED);
        response.send("Only admins can delete other users' devices.");
        return;
    }

    const match = await devicesCollection().findOne({ owner, name });
    if (!match) {
        response.status(StatusCodes.NOT_FOUND).send();
        return;
    }

    await devicesCollection().deleteOne({ owner, name });

    response.sendStatus(StatusCodes.OK);
});

module.exports = router;
