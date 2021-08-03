'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const StatusCodes = require('http-status-codes').StatusCodes;

const router = express.Router();
router.use(express.json());

router.post('/validate', async function(request, response) {
    const token = request.body.token;

    try {
        const info = jwt.verify(token, process.env.JWT_SECRET);
        response.send(info);
    } catch (err) {
        response.status(StatusCodes.NOT_ACCEPTABLE).send('Bad JWT');
        return;
    }
});

module.exports = router;
