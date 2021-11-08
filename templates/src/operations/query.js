'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const { templatesCollection } = require('../db');

const router = express.Router();
router.use(express.json());

router.get('/all', async function(request, response) {
    const query = {};
    const options = {
        projection: {
            _id: 1,
            description: 1,
            name: 1,
            tags: 1,
            thumbnail: 1,
        }
    };
    const result = await templatesCollection().find(query, options);
    const array = await result.toArray();
    response.status(StatusCodes.OK).send(array);
});

module.exports = router;
