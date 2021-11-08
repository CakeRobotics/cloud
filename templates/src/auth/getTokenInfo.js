'use strict';

const axios = require('axios');

module.exports = async function(token) {
    const response = await axios.post(`${process.env.AUTH_SERVICE}/validate`, { token });
    return response.data;
}