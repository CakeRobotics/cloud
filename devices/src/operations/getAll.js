'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { devicesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.get('/', async function(request, response) {
    const { user } = response.locals;
    var query = { };
    if (user.type !== 'admin') {
        query.owner = user.username;
    }
    if (request.query.owner) {
        if (request.query.owner !== user.username && user.type !== 'admin') {
            response.status(StatusCodes.UNAUTHORIZED);
            response.send("Only admins can query other users' simulations.");
            return;
        }
        query.owner = request.query.owner;
    }
    if (request.query.project) {
        query.project = request.query.project;
    }

    const results = await devicesCollection().find(query).sort({ creationDate: -1 });
    const resultsArray = (await results.toArray()).map(device => ({
        ip: device.ip,
        name: device.name,
        online: device.online,
        project: device.project,
        sim: device.sim,
        token: device.token,
    }));
    response.send(resultsArray);
});

module.exports = router;
