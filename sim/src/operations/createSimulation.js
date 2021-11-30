'use strict';

const { default: axios } = require('axios');
const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { simulationsCollection } = require('../db');
const startSimulation_pipeline = require('../pipeline/startSimulation_pipeline');

const router = express.Router();
router.use(express.json());

router.post('/', async function(request, response) {
    const { projectId, world } = request.body;
    var projectFiles = {}
    // Fetch project
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

    // Push new simulation object to DB
    const simulation = {
        creationDate: new Date(),
        owner: response.locals.user.username,
        projectFiles,
        projectId,
        state: "starting",
        step: "storing-new-simulation",
        world,
    }
    const result = await simulationsCollection().insertOne(simulation);
    const simulationId = result.insertedId;

    // Finish request
    response.status(StatusCodes.ACCEPTED).send({ simulationId });

    // Log task
    console.log(`New simulation (ID = ${simulationId}) created:`);
    console.table([simulation], ['owner', 'projectId', '_id']);

    // End task if in test env
    if (process.env.NODE_ENV === 'test') {
        return;
    }

    // Start process
    try {
        var { host, dashboardHost } = await startSimulation_pipeline(simulation);
        // Mark simulation as started, set the url
        await simulationsCollection().updateOne(
            { _id: simulationId },
            {
                $set: {
                    state: "up",
                    url: `http://${host}`,
                    dashboardUrl: `http://${dashboardHost}`,
                    startTime: new Date(),
                },
            }
        );
    } catch (error) {
        await simulationsCollection().updateOne(
            { _id: simulationId },
            {
                $set: {
                    state: "stopped-error",
                    startTime: new Date(),
                    endTime: new Date(),
                },
            }
        );
        throw (error);
    }
});

module.exports = router;
