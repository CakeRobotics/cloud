const { StatusCodes } = require('http-status-codes');
const getTestAgent = require('../utils/getTestAgent');

test('Health', async function() {
    const response = await getTestAgent().get('/health');
    expect(response.statusCode).toEqual(StatusCodes.OK)
})
