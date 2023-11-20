const fs = require('fs');
const { spawn } = require('child_process');
const yaml = require('js-yaml');
const pushLog = require('../pushLog');
const { OC_CMD, OC_FIXED_ARGS } = require('../../config');
const spawnWithLogs = require('../spawnWithLogs');


const apply = async (objects, tmpWorkdir, simulationId) => {
    const yamlFilePaths = [];
    for (const object of objects) {
        const yamlFilePath = `${tmpWorkdir}/${object.kind}_${object.metadata.name}.yaml`;
        const yamlDump = yaml.dump(object, { sortKeys: true });
        await fs.promises.writeFile(yamlFilePath, yamlDump);
        yamlFilePaths.push(yamlFilePath);
    }
    await spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'apply', ...yamlFilePaths.flatMap(path => ['-f', path])],
        spawnOptions: { cwd: tmpWorkdir, timeout: 30_000 },
        simulationId,
        logGroup: 'build-sim',
    });
};


module.exports = apply;
