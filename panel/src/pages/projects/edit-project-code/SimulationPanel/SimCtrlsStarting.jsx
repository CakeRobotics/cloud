import React from 'react';
import { GridLoader } from 'react-spinners';

const SimCtrlsStarting = ({ latestSim }) => {
    return (
        <div className="text-center">
            <div className="action-info-text">Starting the simulation...</div>
            <div className="action-info-sub-text">This may take up to 5 minutes.</div>
            <GridLoader size={5} color="#333" speedMultiplier={0.5}/>
        </div>
    );
}

export default SimCtrlsStarting;