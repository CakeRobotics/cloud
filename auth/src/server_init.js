const registerSuperAdmin = require('./utils/registerSuperAdmin');

module.exports = async function() {
    await registerSuperAdmin();
}
