const fs = require('fs');

const storeUserCodeInTempDir = async (simulationObject) => {
    const dir = `/tmp/sim-${simulationObject._id}`;
    await fs.promises.mkdir(dir, { recursive: true });
    const { props, mainfile } = simulationObject.projectFiles;
    await fs.promises.writeFile(`${dir}/main.py`, mainfile);
    await fs.promises.writeFile(`${dir}/props.json`, JSON.stringify(props));
    return dir;
}

module.exports = storeUserCodeInTempDir;
