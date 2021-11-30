const formatSimulation = (simulation) => {
    var obj = {
        id: simulation._id,
        creationDate: simulation.creationDate,
        owner: simulation.owner,
        projectId: simulation.projectId,
        state: simulation.state,
        world: simulation.world,
    }
    if (simulation.state === 'starting') {
        obj = {
            ...obj,
            step: simulation.step,
        }
    } else if (simulation.state === 'up' || simulation.state === 'reloading') {
        obj = {
            ...obj,
            duration: (new Date()).getTime() - (new Date(simulation.startTime)).getTime(),
            url: simulation.url,
            dashboardUrl: simulation.dashboardUrl,
        }
    } else if (simulation.state.match('stopped')) {
        obj = {
            ...obj,
            duration: (new Date(simulation.endTime)).getTime() - (new Date(simulation.startTime)).getTime(),
        }
    }
    return obj;
}

module.exports = formatSimulation;
