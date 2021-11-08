import React, { useState } from 'react';
import { Button } from 'react-bootstrap'; 
import { ArrowClockwise, BoxArrowUpRight } from 'react-bootstrap-icons';
import { PulseLoader} from 'react-spinners';
import { dispatch } from '../../../../redux/store';
import simulationService from '../../../../services/simulationService';

const SimCtrlsUp = ({ latestSim, refreshSims, dirty }) => {
    const [ waitingForSimStopAccept, setWaitingForSimStopAccept ] = useState(false);
    const [ waitingForSimHotReloadAccept, setWaitingForSimHotReloadAccept ] = useState(false);
    const stopSimulation = async () => {
        setWaitingForSimStopAccept(true);
        await simulationService.stopSimulation(latestSim.id);
        setWaitingForSimStopAccept(false);
        await refreshSims();
    }
    const followLogs = () => {
        dispatch({
            type: 'SET_LOGS_ENDPOINT',
            payload: `/api/sim/${latestSim.id}/logs`,
        })
    }
    const openSimulation = () => {
        const { url } = latestSim;
        window.open(url);
    }
    const hotReload = async () => {
        if (dirty) {
            dispatch({
                type: 'ADD_TOAST',
                payload: {
                    title: "Please save project first.",
                    color: "ERROR",
                    time: new Date(),
                }
            })
            return;
        }
        setWaitingForSimHotReloadAccept(true);
        await simulationService.hotReload(latestSim.id);
        setWaitingForSimHotReloadAccept(false);
        await refreshSims();
    }
    return (
        <div>
            <Button className="me-1" size="sm" onClick={openSimulation}>Open <BoxArrowUpRight/></Button>
            <Button className="me-1" size="sm" variant="danger" onClick={stopSimulation}>
                {waitingForSimStopAccept ? <PulseLoader size={10} color="#fff"/> : <>Stop</>}
            </Button>
            <Button className="me-1" size="sm" variant="secondary" onClick={followLogs}>Show Logs</Button>
            <Button className="mt-1 me-1" size="sm" variant="success" onClick={hotReload}>
                {waitingForSimHotReloadAccept ? <PulseLoader size={10} color="#fff"/> : <>Hot Reload <ArrowClockwise/></>}
            </Button>
        </div>
    )
}

export default SimCtrlsUp;