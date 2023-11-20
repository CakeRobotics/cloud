const { simulationsCollection } = require('../db');

const storePipelineStep = async (simulationId, step) => {
    await simulationsCollection().updateOne(
        { _id: simulationId },
        { $set: { step } }
    );
}

module.exports = storePipelineStep;
