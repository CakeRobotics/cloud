'use strict';

const { default: axios } = require('axios');
const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { ObjectId } = require('mongodb');

const { simulationsCollection } = require('../db');
const hotReload_pipeline = require('../pipeline/hotReload_pipeline');
const deepEqual = require('deep-equal');

const router = express.Router();
router.use(express.json());

router.post('/:simulationId/hotreload', async function(request, response) {
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
    if (simulation.state !== 'up') {
        response.status(StatusCodes.NOT_ACCEPTABLE).send(`Action 'stop' can't be applied to a sim in state ${simulation.state}.`);
        return;
    }

    // Fetch project
    const { projectId } = simulation;
    var projectFiles = {}
    try {
        const headers = { Authorization: `Bearer ${response.locals.auth_token}` };
        const projectEndpoint = `${process.env.PROJECTS_SERVICE}/${response.locals.user.username}/${projectId}`;

        const propsResponse = await axios.get(`${projectEndpoint}/props.json`, { headers });
        projectFiles.props = propsResponse.data;
        projectFiles.props.sim = true;

        const mainfileResponse = await axios.get(`${projectEndpoint}/main.py`, { headers });
        projectFiles.mainfile = mainfileResponse.data;
    } catch (error) {
        // Also includes access control since projects service has access check.
        response.status(error.response.status).send(error.response.data);
        console.log(error.response.data)
        return;
    }

    // Make sure props are unchanged
    if (!deepEqual(simulation.projectFiles.props, projectFiles.props, { strict: true })) {
        response.status(StatusCodes.CONFLICT).send("Hot-reload is not possible because project props have changed.");
        return;
    }

    // Update simulation object
    await simulationsCollection().updateOne(
        { _id },
        {
            $set: {
                projectFiles,
                state: "reloading",
            },
        }
    );
    const newSimulationObject = {
        ...simulation,
        projectFiles,
        state: "reloading",
    }

    // Finish request
    response.status(StatusCodes.ACCEPTED).send();

    // End task if in test env
    if (process.env.NODE_ENV === 'test') {
        return;
    }

    // Do Hot-reload
    try {
        await hotReload_pipeline(newSimulationObject);
        await simulationsCollection().updateOne(
            { _id },
            {
                $set: {
                    state: "up",
                },
            }
        );
    } catch (error) {
        await simulationsCollection().updateOne(
            { _id },
            {
                $set: {
                    state: "stopped-error",
                    endTime: new Date(),
                },
            }
        );
        throw (error);
    }
});

module.exports = router;
