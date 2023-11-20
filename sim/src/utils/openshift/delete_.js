const fs = require('fs');
const yaml = require('js-yaml');
const { OC_CMD, OC_FIXED_ARGS } = require('../../config');
const spawnWithLogs = require('../spawnWithLogs');


const delete_ = async (objects, tmpWorkdir, simulationId) => {
    const yamlFilePaths = [];
    for (const object of objects) {
        const yamlFilePath = `${tmpWorkdir}/${object.kind}_${object.metadata.name}.yaml`;
        const yamlDump = yaml.dump(object, { sortKeys: true });
        await fs.promises.writeFile(yamlFilePath, yamlDump);
        yamlFilePaths.push(yamlFilePath);
    }
    await spawnWithLogs({
        cmd: OC_CMD,
        args: [...OC_FIXED_ARGS, 'delete', ...yamlFilePaths.flatMap(path => ['-f', path])],
        spawnOptions: { cwd: tmpWorkdir, timeout: 30_000 },
        simulationId,
        logGroup: 'stop-sim',
    });
};


module.exports = delete_;
