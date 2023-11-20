'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { simulationsCollection } = require('../db');
const { ObjectId } = require('mongodb');
const formatSimulation = require('../utils/formatSimulation');

const router = express.Router();
router.use(express.json());

router.get('/:simulationId', async function(request, response) {
    // Get from DB
    const { simulationId } = request.params;
    var _id;
    try {
        _id = new ObjectId(simulationId);
    } catch (error) {
        response.status(StatusCodes.BAD_REQUEST).send('Invalid id.');
        return;
    }
    const simulation = await simulationsCollection().findOne({ _id });

    // Existance check
    if (!simulation) {
        response.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    // Access control
    if (simulation.owner !== response.locals.user.username && response.locals.user.type !== 'admin') {
        response.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }

    // Response
    const responseData = formatSimulation(simulation);
    response.send(responseData);
});

module.exports = router;
