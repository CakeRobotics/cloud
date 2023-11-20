'use strict';

const { StatusCodes } = require('http-status-codes');

const getTokenInfo = require("./getTokenInfo");

// Runs `f` iff valid admin auth token is provided.
module.exports = function(f) {
    return async function(request, response) {
        // Check auth header existance and format
        try {
            const authorizationHeader = request.headers.authorization;
            var token = (/Bearer (.+)/).exec(authorizationHeader)[1];
        } catch (error) {
            response.status(StatusCodes.UNAUTHORIZED).send('This action requires auth token.');
            return;
        }

        // Validate token and get extra info about the user
        var userInfo;
        try {
            userInfo = await getTokenInfo(token);
        } catch (error) {
            if (error.response.status == StatusCodes.NOT_ACCEPTABLE) {
                response.status(StatusCodes.NOT_ACCEPTABLE).send('Bad JWT token.');
            } else {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Unknown error. More info: ' + error);
            }
            return;
        }

        // Block if user is not admin
        if (userInfo.type !== 'admin') {
            response.status(StatusCodes.UNAUTHORIZED).send('Access denied. Admin user is required.');
            return;
        }

        // Pass
        return await f(request, response);
    }
}