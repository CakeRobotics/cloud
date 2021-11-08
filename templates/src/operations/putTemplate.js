'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { ObjectId } = require('mongodb');

const { templatesCollection } = require('../db');
const requireAdmin = require('../auth/requireAdmin');

const router = express.Router();
router.use(express.json());

router.put(
'/all/:template',
requireAdmin(
async function(request, response) {
    // Validate id & create ObjectId object
    const id = request.params.template;
    var _id;
    try {
        _id = new ObjectId(id);
    } catch (error) {
        response.status(StatusCodes.BAD_REQUEST).send('Invalid id.');
        return;
    }

    // Get template
    const query = { _id };
    const result = await templatesCollection().findOne(query);
    
    // Verify existance
    if (!result) {
        response.status(StatusCodes.NOT_FOUND).send();
        return;
    }

    // Validate new template name
    const name = request.body.name;
    if (!name) {
        response.status(StatusCodes.BAD_REQUEST).send('"name" field is required.');
        return;
    }

    // Update template
    const updateQuery = { _id };
    await templatesCollection().replaceOne(updateQuery, request.body); // FIXME: Validation needed -- esp. for when admin requirement is going to be removed.
    response.status(StatusCodes.OK).send();
}));

module.exports = router;
