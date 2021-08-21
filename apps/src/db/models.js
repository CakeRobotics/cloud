'use strict';

const db = require('./db');
const { DataTypes, NOW } = require('sequelize');


const App = db.define('App', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastCodeChange: {
        type: DataTypes.DATE,
        defaultValue: NOW,
    }
});

module.exports = {
    App,
};