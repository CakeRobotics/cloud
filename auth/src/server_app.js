'use strict';

const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet())

const endpoints = [
    "/createRegistrationToken",
    "/health",
    "/login",
    "/register",
    "/users",
    "/validate",
];

endpoints.forEach(function(endpoint) {
    const router = require('./endpoints' + endpoint);
    app.use(router);
});

module.exports = app
