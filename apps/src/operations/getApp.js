'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');

const router = express.Router();
router.use(express.json());

router.get(
'/:username/:app',
requireOwnership(
async function(request, response) {
    const username = request.params.username;
    const appName = request.params.app;

    // Get app
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

    response.status(StatusCodes.OK).send(foundApps[0]);
}));

module.exports = router;
