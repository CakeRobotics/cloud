'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { projectsCollection } = require('../db');
const requireOwnership = require('../auth/requireOwnership');

const router = express.Router();
router.use(express.json());

router.get(
'/:username',
requireOwnership(
async function(request, response) {
    // Get data
    const username = request.params.username;
    const query = {
        owner: username,
    };
    const result = await projectsCollection().find(query).sort({ lastChange: -1 });
    const resultsArray = await result.toArray();

    // Transform to compact list
    const compactProjectsList = resultsArray.map(project => ({
        _id: project._id,
        name: JSON.parse(project.files['props.json']).name, // TODO: Cache project name
        lastChange: project.lastChange,
        owner: project.owner,
    }));

    // Return
    response.status(StatusCodes.OK).send(compactProjectsList);
}));

module.exports = router;
