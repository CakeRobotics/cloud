const { StatusCodes } = require('http-status-codes');
const { default: axios } = require('axios');

const createTemplate = require('./createTemplate');

module.exports = async function(user) {
    const template_id = await createTemplate();
    const payload = { template_id }
    const projectCreationResponse = await axios.post(
        `${process.env.PROJECTS_SERVICE}/${user.username}`,
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
    )
    expect(projectCreationResponse.status).toEqual(StatusCodes.CREATED);
    const projectId = projectCreationResponse.data;
    return projectId;
}
