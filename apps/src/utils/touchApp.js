'use strict';

// This function bumps `lastCodeChange` field of an App to current time.

const { App } = require('../db/models');
const { literal } = require('sequelize');

module.exports = async function(username, appName) {
    await App.update(
        {
            lastCodeChange: literal('CURRENT_TIMESTAMP'),
        },
        {
            where: {
                name: appName,
                owner: username,
            },
        }
    );
}
