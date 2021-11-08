'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { ObjectId } = require('mongodb');

const { projectsCollection } = require('../db');
const requireOwnership = require('../auth/requireOwnership');

const router = express.Router();
router.use(express.json());

router.delete(
'/:username/:project',
requireOwnership(
async function(request, response) {
    const id = request.params.project;

    // Validate id & create ObjectId object
    var _id;
    try {
        _id = new ObjectId(id);
    } catch (error) {
        response.status(StatusCodes.BAD_REQUEST).send('Invalid id.');
        return;
    }

    // Get project
    const query = { _id };
    const result = await projectsCollection().findOne(query);
    
    // Verify existance
    if (!result) {
        response.status(StatusCodes.NOT_FOUND).send();
        return;
    }

    // Delete project
    await projectsCollection().deleteOne(query);
    response.status(StatusCodes.OK).send();
}));

module.exports = router;
