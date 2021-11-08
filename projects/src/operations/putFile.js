'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { ObjectId } = require('mongodb');

const { projectsCollection } = require('../db');
const requireOwnership = require('../auth/requireOwnership');

const router = express.Router();
router.use(express.text());

router.put(
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

    // Validate content type
    const requestContentType = request.headers['content-type'];
    if (requestContentType.toLowerCase() !== 'text/plain; charset=utf-8') {
        response.status(StatusCodes.BAD_REQUEST).send(
            "Only 'text/plain; charset=utf-8' content-type is valid."
        );
        return;
    }

    // Update project
    const updatedFileContent = request.body;
    const updatedProject = {
        ...project,
        files: {
            ...project.files,
            [fileName]: updatedFileContent,
        },
        lastChange: new Date(),
    };
    const updateQuery = { _id };
    await projectsCollection().replaceOne(updateQuery, updatedProject); // FIXME: Validation needed -- esp. for when admin requirement is going to be removed.
    response.status(StatusCodes.OK).send();
}));

module.exports = router;
