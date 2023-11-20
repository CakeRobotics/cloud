const { StatusCodes } = require('http-status-codes');
const getHttpAgent = require('../utils/getHttpAgent');

test('Health', async function() {
    const response = await getHttpAgent().get('/health');
    expect(response.statusCode).toEqual(StatusCodes.OK);
})
