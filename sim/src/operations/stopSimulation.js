'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { simulationsCollection } = require('../db');
const { ObjectId } = require('mongodb');
const stopSimulation_pipeline = require('../pipeline/stopSimulation_pipeline');

const router = express.Router();
router.use(express.json());

router.post('/:simulationId/stop', async function(request, response) {
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

    // Assert simulation is up
    if (!(simulation.state === 'up' || simulation.state === 'reloading')) {
        response.status(StatusCodes.NOT_ACCEPTABLE).send(`Action 'stop' can't be applied to a sim in state ${simulation.state}.`);
        return;
    }

    response.sendStatus(StatusCodes.ACCEPTED);

    // Update DB
    await simulationsCollection().updateOne(
        { _id },
        {
            $set: {
                state: "stopped-user",
                endTime: new Date(),
            }
        }
    );

    await stopSimulation_pipeline(simulationId);
});

module.exports = router;
