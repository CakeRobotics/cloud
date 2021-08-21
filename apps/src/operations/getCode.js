'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');
const getCode = require('../code/getCode');

const router = express.Router();
router.use(express.json());

router.get(
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

    // Read main file
    const code = await getCode(username, appName);

    response.status(StatusCodes.OK).send(code);
}));

module.exports = router;
