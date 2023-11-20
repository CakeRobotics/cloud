const storePipelineStep = require('../utils/storePipelineStep');
const startSimNode = require('./tasks/startSimNode/startSimNode');

const startSimulation_pipeline = async (baseSimulationObject, authHeader) => {
    await storePipelineStep('start-sim-node');
    const simulationHostname = await startSimNode(baseSimulationObject, authHeader);
    await storePipelineStep('running');
    return simulationHostname;
}

module.exports = startSimulation_pipeline;
