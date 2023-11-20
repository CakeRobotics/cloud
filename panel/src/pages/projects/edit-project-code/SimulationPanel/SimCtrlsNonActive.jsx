import React, { useState } from 'react';
import { Play } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap'; 
import Select from 'react-select';
import { PulseLoader} from 'react-spinners';

import { dispatch } from '../../../../redux/store';
import simulationService from '../../../../services/simulationService';


const SimCtrlsNonActive = ({ projectId, dirty, refreshSims }) => {
    const [ waitingForSimStartAccept, setWaitingForSimStartAccept ] = useState(false);
    const [ world, setWorld ] = useState('');
    const startSimulation = async () => {
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
        setWaitingForSimStartAccept(true);
        const simulationId = await simulationService.createSimulation({
            projectId,
            world: world ? world.value : "",
        });
        dispatch({
            type: 'SET_LOGS_ENDPOINT',
            payload: `/api/sim/${simulationId}/logs`,
        })
        setWaitingForSimStartAccept(false);
        await refreshSims();
    }
    return (<>
        <div className="d-flex">
            <Select
                className="flex-grow-1 me-2"
                placeholder="Select world..."
                value={world}
                onChange={setWorld}
                options={[
                    { value: '', label: 'Default' },
                    { value: 'cafe', label: 'Cafe' },
                ]}
            />
            <Button size="sm" onClick={startSimulation}>
                {waitingForSimStartAccept ? <PulseLoader size={10} color="#fff"/> : <>Simulate <Play/></>}
            </Button>
        </div>

    </>);
}

export default SimCtrlsNonActive;