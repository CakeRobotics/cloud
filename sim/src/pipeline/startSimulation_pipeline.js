const storePipelineStep = require('../utils/storePipelineStep');
const buildAppImage = require('./tasks/buildAppImage/buildAppImage');
const startSimNode = require('./tasks/startSimNode/startSimNode');

const startSimulation_pipeline = async (baseSimulationObject) => {
    await storePipelineStep('build-app-image');
    const { dockerImageName, tmpWorkdir } = await buildAppImage(baseSimulationObject);
    await storePipelineStep('start-sim-node');
    const { host, dashboardHost } = await startSimNode(baseSimulationObject, dockerImageName, tmpWorkdir);
    await storePipelineStep('running');
    return { host, dashboardHost };
}

module.exports = startSimulation_pipeline;
