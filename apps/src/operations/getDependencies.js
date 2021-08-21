'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');
const getDependencies = require('../code/getDependencies');

const router = express.Router();
router.use(express.json());

router.get(
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

    // Read dependencies file
    const dependenciesJSON = await getDependencies(username, appName);
    const dependencies = JSON.parse(dependenciesJSON);

    response.status(StatusCodes.OK).send(dependencies);
}));

module.exports = router;
