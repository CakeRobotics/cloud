'use strict';

const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const db = require('../db');

module.exports = function requireAdmin(f) {
    return async function(request, response) {
        try {
            const authorizationHeader = request.headers.authorization;
            var token = (/Bearer (.+)/).exec(authorizationHeader)[1];
        } catch (error) {
            response.status(StatusCodes.UNAUTHORIZED).send('This action requires admin user.');
            return;
        }

        var info;
        try {
            info = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            response.status(StatusCodes.NOT_ACCEPTABLE).send('Bad JWT');
            return;
        }

        const username = info.username;
        const foundUsers = await db.query('SELECT type FROM users WHERE username = $1', [username]);
        const type = foundUsers.rows[0].type;

        if (type !== 'admin') {
            response.status(StatusCodes.UNAUTHORIZED).send('This action requires admin user.');
            return;
        }

        return await f(request, response);
    }
}