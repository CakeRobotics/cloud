'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const { ObjectId } = require('mongodb');

const { templatesCollection } = require('../db');
const requireAdmin = require('../auth/requireAdmin');

const router = express.Router();
router.use(express.json());

router.delete(
'/all/:template',
requireAdmin(
async function(request, response) {
    const id = request.params.template;

    // Validate id & create ObjectId object
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

    // Delete template
    await templatesCollection().deleteOne(query);
    response.status(StatusCodes.OK).send();
}));

module.exports = router;
