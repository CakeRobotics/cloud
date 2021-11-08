const { StatusCodes } = require('http-status-codes');
const { default: axios } = require('axios');

const randomString = require('./randomString');
const { testUsers } = require('../utils/testUsers');

module.exports = async function() {
    const template = {
        name: `test-template-${randomString()}`,
    }
    const templateCreationResponse = await axios.post(
        `${process.env.TEMPLATES_SERVICE}/all`,
        template,
        { headers: { Authorization: `Bearer ${testUsers.admin.token}` } }
    )
    expect(templateCreationResponse.status).toEqual(StatusCodes.CREATED);
    const templateId = templateCreationResponse.data;
    return templateId;
}
