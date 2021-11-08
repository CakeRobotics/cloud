'use strict';

const { default: axios } = require('axios');
const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { projectsCollection } = require('../db');
const requireOwnership = require('../auth/requireOwnership');
const templateToProject = require('../core/templateToProject');

const router = express.Router();
router.use(express.json());

router.post(
'/:username',
requireOwnership(
async function(request, response) {
    const template_id = request.body.template_id;

    // Validate project name
    if (!template_id) {
        response.status(StatusCodes.BAD_REQUEST).send('"name" field is required.');
        return;
    }

    // Fetch template
    try {
        var fetchTemplateResponse = await axios.get(`${process.env.TEMPLATES_SERVICE}/all/${template_id}`);
    } catch (error) {
        response.status(error.response.status).send(error.response.data);
        console.log(error.response.data)
        return;
    }
    const template = fetchTemplateResponse.data;

    // Transform template
    const owner = request.params.username;
    const project = templateToProject(template, owner);

    // Create project
    const result = await projectsCollection().insertOne(project);
    const id = result.insertedId;

    console.log(`New project '${id}' was created for user ${request.params.username}.`);
    response.status(StatusCodes.CREATED).send(id);
}));

module.exports = router;
