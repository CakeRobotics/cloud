'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');
const putDependencies = require('../code/putDependencies');
const touchApp = require('../utils/touchApp');

const router = express.Router();
router.use(express.json());

router.put(
'/:username/:app/dependencies',
requireOwnership(
async function(request, response) {
    const username = request.params.username;
    const appName = request.params.app;

    // Ensure app exists
    const foundApps = await App.findAll({
        where: {
            name: appName,
            owner: username,
        }
    });
    if (foundApps.length == 0) {
        response.status(StatusCodes.NOT_FOUND).send('App not found.');
        return;
    }

    // Write dependencies file
    const dependencies = request.body;
    const dependenciesJSON = JSON.stringify(dependencies);
    await putDependencies(username, appName, dependenciesJSON);

    // Update lastCodeUpdate field to NOW
    await touchApp(username, appName);

    response.status(StatusCodes.OK).send("Dependencies were updated.");
}));

module.exports = router;
