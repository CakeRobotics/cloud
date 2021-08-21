'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');
const putCode = require('../code/putCode');
const touchApp = require('../utils/touchApp');

const router = express.Router();
router.use(express.json());

router.put(
'/:username/:app/code',
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

    // Write main file
    const code = request.body.code;
    await putCode(username, appName, code);

    // Update lastCodeUpdate field to NOW
    await touchApp(username, appName);

    response.status(StatusCodes.OK).send("Code was updated.");
}));

module.exports = router;
