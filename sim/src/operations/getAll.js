'use strict';

const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { simulationsCollection } = require('../db');
const formatSimulation = require('../utils/formatSimulation');

const router = express.Router();
router.use(express.json());

router.get('/', async function(request, response) {
    const { user } = response.locals;
    var query = {};
    if (user.type !== 'admin') {
        query.owner = user.username;
    }
    if (request.query.owner) {
        if (request.query.owner !== user.username && user.type !== 'admin') {
            response.status(StatusCodes.UNAUTHORIZED);
            response.send("Only admins can query other users' simulations.");
            return;
        }
        query.owner = request.query.owner;
    }
    if (request.query.projectId) {
        query.projectId = request.query.projectId;
    }

    const results = await simulationsCollection().find(query).sort({ creationDate: -1 });
    const resultsArray = (await results.toArray()).map(formatSimulation);
    response.send(resultsArray);
});

module.exports = router;
