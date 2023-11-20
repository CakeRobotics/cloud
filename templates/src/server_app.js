'use strict';

const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet())

const operations = [
    // Public Templates
    "createTemplate",
    "deleteTemplate",
    "getTemplate",
    "query",
    "putTemplate",

    // Misc
    "health",
];

operations.forEach(function(operation) {
    const router = require(`./operations/${operation}`);
    app.use(router);
});

module.exports = app
