'use strict';

const { StatusCodes } = require('http-status-codes');

const getTokenInfo = require("./getTokenInfo");

// Only runs `f` if username in path is the same as username in auth token
// *or* user in auth token is admin.
module.exports = function(f) {
    return async function(request, response) {
        const appOwnerUsername = request.params.username;

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

        // Grant if user is app owner or is admin
        const userIsAdmin = userInfo.type === 'admin';
        const userIsOwner = userInfo.username === appOwnerUsername;
        if (userIsAdmin || userIsOwner) {
            return await f(request, response);
        }

        response.status(StatusCodes.UNAUTHORIZED).send('Access denied.');
        return;
    }
}