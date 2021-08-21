'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');
const initAppPath = require('../code/initAppPath');

const router = express.Router();
router.use(express.json());

router.post(
'/:username/:app',
requireOwnership(
async function(request, response) {
    const username = request.params.username;
    const appName = request.params.app;

    // Validate app name
    if (!appName.match(/^[a-zA-Z0-9\-]{3,40}$/g)) {
        response.status(StatusCodes.BAD_REQUEST).send('App name must only contain 3-40 alphanumericals and hyphens.');
        return;
    }

    // Check for duplicates
    const duplicates = await App.findAll({ where: {
        name: appName,
        owner: username,
    }});
    if (duplicates.length > 0) {
        response.status(StatusCodes.CONFLICT).send('App already exists.');
        return;
    }

    // Create files and directories
    await initAppPath(username, appName);

    // Create app
    await App.create({
        name: appName,
        owner: username,
    });

    console.log(`New app '${username}/${appName}' was registered.`);
    response.status(StatusCodes.CREATED).send('App was created.');
}));

module.exports = router;
