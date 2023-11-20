'use strict';

const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;

const router = express.Router();
router.use(express.json());

router.get('/health', async function(_request, response) {
    response.sendStatus(StatusCodes.OK);
});

module.exports = router;
