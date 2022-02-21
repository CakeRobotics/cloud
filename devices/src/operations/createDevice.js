'use strict';

const crypto = require('crypto');

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { MongoError } = require('mongodb')

const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.post('/', async function(request, response) {
    const { name, sim, project } = request.body;
    const owner = response.locals.user.username;
    const token = crypto.randomBytes(24).toString('base64url');

    if (!name) {
        response.status(StatusCodes.BAD_REQUEST).send('"name" is mandatory in body.');
        return;
    }

    // Push new device object to DB
    const device = {
        _id: `${owner}/${name}`,
        creationDate: new Date(),
        ip: undefined,
        name,
        online: false,
        owner,
        project,
        sim: sim || false,
        socketId: undefined,
        token,
    }
    try {
        await devicesCollection().insertOne(device);
    } catch (exception) {
        if (exception instanceof MongoError && exception.code === 11000) {
            response.status(StatusCodes.CONFLICT).send('Another device with the same name exists.');
            return;
        }
        throw exception;
    }

    // Finish request
    response.sendStatus(StatusCodes.CREATED);
});

module.exports = router;
