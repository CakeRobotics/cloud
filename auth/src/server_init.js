const waitForDatabaseConnection = require('./utils/waitForDatabaseConnection');
const registerSuperAdmin = require('./utils/registerSuperAdmin');

module.exports = async function() {
    await waitForDatabaseConnection();
    await registerSuperAdmin();
}
