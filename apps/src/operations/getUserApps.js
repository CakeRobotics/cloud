'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { App } = require('../db/models');
const requireOwnership = require('../auth/requireOwnership');

const router = express.Router();
router.use(express.json());

router.get(
'/:username',
requireOwnership(
async function(request, response) {
    const username = request.params.username;

    // List apps
    const apps = await App.findAll({
        attributes: ['name', 'lastCodeChange'],
        where: {
            owner: username,
        },
        order: [
            ['lastCodeChange', 'DESC'],
        ]
    });

    response.status(StatusCodes.OK).send(apps);
}));

module.exports = router;
