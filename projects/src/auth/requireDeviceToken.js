'use strict';

const { StatusCodes } = require('http-status-codes');
const axios = require('axios');

// TODO: add tests
module.exports = function(f) {
    return async function(request, response) {
        const { project, owner } = request.params.project;
        const projectId = `${owner}/${project}`;

        // Check auth header existance and format
        try {
            const authorizationHeader = request.headers.authorization;
            var token = (/Device (.+)/).exec(authorizationHeader)[1];
        } catch (error) {
            response.status(StatusCodes.UNAUTHORIZED).send('Failed to extract device auth token.');
            return;
        }

        // Validate token and get extra info about the user
        try {
            await axios.post(`${process.env.DEVICES_SERVICE}/check_access`, { token, projectId });
        } catch (error) {
            if (error.response.status !== StatusCodes.UNAUTHORIZED) {
                response.status(error.response.status).send(error.response.body);
                return;
            }
        }

        // Grant.
        return await f(request, response);
    }
}