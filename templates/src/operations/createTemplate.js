'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { templatesCollection } = require('../db');
const requireAdmin = require('../auth/requireAdmin');

const router = express.Router();
router.use(express.json());

router.post(
'/all',
requireAdmin(
async function(request, response) {
    const name = request.body.name;

    // Validate template name
    if (!name) {
        response.status(StatusCodes.BAD_REQUEST).send('"name" field is required.');
        return;
    }

    // Create template
    const result = await templatesCollection().insertOne(request.body); // FIXME: Validation needed -- esp. for when admin requirement is going to be removed.
    const id = result.insertedId;

    console.log(`New template '${name}' was created.`);
    response.status(StatusCodes.CREATED).send(id);
}));

module.exports = router;
