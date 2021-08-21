'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');

const router = express.Router();
router.use(express.json());

router.delete(
'/:username/:app',
requireOwnership(
async function(request, response) {
    const username = request.params.username;
    const appName = request.params.app;

    // Check if app exists
    const foundApps = await App.findAll({
        attributes: ['name', 'owner', 'lastCodeChange'],
        where: {
            name: appName,
            owner: username,
        }
    });
    if (foundApps.length == 0) {
        response.status(StatusCodes.NOT_FOUND).send('App not found.');
        return;
    }

    // Delete app
    await App.destroy({
        where: {
            // Implicit AND operation
            name: appName,
            owner: username,
        },
    });

    console.log(`App '${username}/${appName}' was deleted.`);
    response.status(StatusCodes.OK).send('App was deleted.');
}));

module.exports = router;
