const { spawn } = require('child_process');
const { OC_CMD, OC_FIXED_ARGS } = require('../../config');
const parseOpenshiftTable = require('./utils/parseOpenshiftTable');

const get = async (resource) => {
    const args = Array.isArray(resource) ? resource : [resource];
    return new Promise((resolve, reject) => {
        var output = "";
        const process = spawn(
            OC_CMD, [...OC_FIXED_ARGS, 'get', ...args],
            { timeout: 30000 },
        );
        process.on("close", (exitCode) => {
            if (exitCode == 0) {
                const data = parseOpenshiftTable(output);
                resolve(data);
            } else {
                reject(output);
            }
        });
        process.stdout.on("data", (data) => {
            output += data.toString();
        });
        process.stderr.on("data", (data) => {
            output += data.toString();
        })
    });
};

module.exports = get;
