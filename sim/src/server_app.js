'use strict';

const express = require('express');
const helmet = require('helmet');
const requireLogin = require('./auth/requireLogin');

const app = express();
app.use(helmet());


/// Unprotected (no login) routes
const unprotectedOperations = [
    "health",
];

unprotectedOperations.forEach(function(operation) {
    const router = require(`./operations/${operation}`);
    app.use(router);
});


/// Protected routes
app.use(requireLogin);

const operations = [
    "createSimulation",
    "getAll",
    "getLogs",
    "getSimulation",
    "hotReload",
    "stopSimulation",
];

operations.forEach(function(operation) {
    const router = require(`./operations/${operation}`);
    app.use(router);
});

module.exports = app
