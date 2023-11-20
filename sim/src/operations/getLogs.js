'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { simulationsCollection } = require('../db');
const { ObjectId } = require('mongodb');

const router = express.Router();
router.use(express.json());

router.get('/:simulationId/logs', async function(request, response) {
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

    var logs = simulation.logs || [];

    // Apply security filters
    logs = logs.filter(log => log.hidden === false);

    // Apply query filters
    const groupFilter = request.query.group;
    if (groupFilter) {
        logs = logs.filter(log => log.group === groupFilter);
    }

    // Return
    response.send(logs);
});

module.exports = router;
