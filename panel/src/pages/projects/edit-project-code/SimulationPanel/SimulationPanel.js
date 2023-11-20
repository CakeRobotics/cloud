import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap'; 
import { PulseLoader } from 'react-spinners';
import { withRouter } from 'react-router';

import simulationService from '../../../../services/simulationService';
import SimCtrlsNonActive from './SimCtrlsNonActive';
import SimCtrlsStarting from './SimCtrlsStarting';
import SimCtrlsUp from './SimCtrlsUp';
import SimulationsList from './SimulationsList';

class UnreduxSimulationPanel extends Component {
    state = {
        simList: null,
    }
    async componentDidMount() {
        await this.refreshSims();
        // this.setState({
        //     simList: [
        //         {
        //             state: "starting",
        //             creationDate: new Date(),
        //         }
        //     ]
        // })
    }
    refreshSims = async () => {
        // this.setState({ simList: null });
        const { projectId } = this.props.match.params;
        const simList = await simulationService.getAll(projectId);
        this.setState({ simList });

        const latestSim = simList && simList[0];
        if (latestSim && (latestSim.state === "starting" || latestSim.state === "up" || latestSim.state === "reloading")) {
            setTimeout(this.refreshSims, 5000);
        }
    }
    render() {
        const { projectId } = this.props.match.params;
        const latestSim = this.state.simList && this.state.simList[0];
        var content;
        if (this.state.simList === null) {
            content = <PulseLoader size={10} color="#666"/>;
        } else if (latestSim && latestSim.state === "starting") {
            content = <SimCtrlsStarting refreshSims={this.refreshSims} latestSim={latestSim}/>
        } else if (latestSim && (latestSim.state === "up" || latestSim.state === "reloading")) {
            content = <SimCtrlsUp refreshSims={this.refreshSims} latestSim={latestSim} dirty={this.props.dirty}/>
        } else {
            content = <SimCtrlsNonActive refreshSims={this.refreshSims} projectId={projectId} dirty={this.props.dirty}/>
        }
        return (
            <Container className="sidebar-panel">
                { content }
                <SimulationsList simList={this.state.simList} />
            </Container>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        pageState: state.projects.current.state,
        projectId: state.projects.current.name,
        dirty: state.projects.current.dirty,
    }
}


const SimulationPanel = connect(mapStateToProps)(UnreduxSimulationPanel);

export default withRouter(SimulationPanel);