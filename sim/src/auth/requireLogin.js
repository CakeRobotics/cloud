'use strict';
const { StatusCodes } = require('http-status-codes');
const getTokenInfo = require("./getTokenInfo");

// Does the following
// - Runs next() iff any valid auth token is provided. Otherwise aborts with an error status code.
// - sets response.locals.user to an object holding keys: 'username', 'type', 'email'.
// - sets response.locals.auth_token to the token (either from auth header or cookies [latter not implemented yet])
module.exports = async function(request, response, next) {
    // Check auth header existance and format
    try {
        const authorizationHeader = request.headers.authorization;
        var token = (/Bearer (.+)/).exec(authorizationHeader)[1];
        response.locals.auth_token = token;
    } catch (error) {
        response.status(StatusCodes.UNAUTHORIZED).send('This action requires auth token.');
        return;
    }

    // Validate token and get extra info about the user
    try {
        response.locals.user = await getTokenInfo(token);
    } catch (error) {
        if (error.response.status == StatusCodes.NOT_ACCEPTABLE) {
            response.status(StatusCodes.NOT_ACCEPTABLE).send('Bad JWT token.');
        } else {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Unknown error. More info: ' + error);
        }
        return;
    }

    // Pass
    next();
}
