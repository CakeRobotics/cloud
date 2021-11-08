var config = require("./config.arvan");

config.OC_FIXED_ARGS = [
    "--kubeconfig",
    "/root/.arvan/paasconfig",
    "-n",
    config.OC_PROJECT,
];

config.CAKE_BUNDLER = 'cake-bundler'

module.exports = config;
