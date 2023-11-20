'use strict';

const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet())

const operations = [
    // Misc
    "health",

    // Projects
    "createProject",
    "deleteProject",
    "getAll",
    "getFile",
    "putFile",
];

operations.forEach(function(operation) {
    const router = require(`./operations/${operation}`);
    app.use(router);
});

module.exports = app
