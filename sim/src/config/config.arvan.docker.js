var config = require("./config.arvan");

config.OC_FIXED_ARGS = [
    "--kubeconfig",
    "/root/.arvan/paasconfig",
    "-n",
    config.OC_PROJECT,
];

config.PYTHON_EXEC = 'python3'

module.exports = config;
