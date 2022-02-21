'use strict';

const { StatusCodes } = require('http-status-codes');
const requireOwnership = require('./requireOwnership');
const requireDeviceToken = require('./requireDeviceToken');

// Only runs `f` if username in path is the same as username in auth token
// *or* user in auth token is admin.
module.exports = function(f) {
    return async function(request, response) {
        const authorizationHeader = request.headers.authorization;
        if (authorizationHeader.match(/Bearer.+/)) {
            return (requireOwnership(f))(request, response);
        } else if (authorizationHeader.match(/Device.+/)) {
            return (requireDeviceToken(f))(request, response);
        }
        response.status(StatusCodes.UNAUTHORIZED).send('Bearer or Device auth token is required.');
    }
}