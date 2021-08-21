'use strict';

const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet())

const operations = [
    "health", // Keep on top to give priority over /:username
    "createApp",
    "deleteApp",
    "getApp",
    "getCode",
    "getDependencies",
    "getUserApps",
    "putCode",
    "putDependencies",
];

operations.forEach(function(operation) {
    const router = require(`./operations/${operation}`);
    app.use(router);
});

module.exports = app
