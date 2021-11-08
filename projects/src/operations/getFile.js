'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { ObjectId } = require('mongodb');

const { projectsCollection } = require('../db');
const requireOwnership = require('../auth/requireOwnership');

const router = express.Router();
router.use(express.json());

router.get(
'/:username/:project/:file',
requireOwnership(
async function(request, response) {
    // Validate id & create ObjectId object
    const id = request.params.project;
    var _id;
    try {
        _id = new ObjectId(id);
    } catch (error) {
        response.status(StatusCodes.BAD_REQUEST).send('Invalid id.');
        return;
    }

    // Validate file name
    const fileName = request.params.file;
    const allowedFileNames = ['props.json', 'main.py'];
    if (! allowedFileNames.find(allowedFileName => allowedFileName === fileName)) {
        response.status(StatusCodes.NOT_IMPLEMENTED).send("Only 'props.json' and 'main.py' files are allowed.");
        return;
    }

    // Get project
    const query = { _id };
    const project = await projectsCollection().findOne(query);
    
    // Verify existance
    if (!project) {
        response.status(StatusCodes.NOT_FOUND).send();
        return;
    }

    // Return file
    const fileContent = project.files[fileName];
    response.status(StatusCodes.OK).set('content-type', 'text/plain; charset=utf-8').send(fileContent);
}));

module.exports = router;
