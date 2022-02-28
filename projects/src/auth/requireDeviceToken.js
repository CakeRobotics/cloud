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
        const accessResponse = await axios.post(`${process.env.DEVICES_SERVICE}/check_access`, { token, projectId });
        if (accessResponse.status !== StatusCodes.UNAUTHORIZED) {
            response.status(accessResponse.status).send(accessResponse.body);
            return;
        }

        // Grant.
        return await f(request, response);
    }
}