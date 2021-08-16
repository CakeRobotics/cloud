const waitForDatabaseConnection = require('./utils/waitForDatabaseConnection');
const createDatabaseTables = require('./utils/createDatabaseTables');
const registerSuperAdmin = require('./utils/registerSuperAdmin');

module.exports = async function() {
    await waitForDatabaseConnection();
    await createDatabaseTables();
    await registerSuperAdmin();
}
