import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { dispatch } from '../../../../redux/store';
import './SimulationsList.css';

const formatDuration = (millis) => {
    if (millis === undefined) {
        return "NaN";
    }
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const SimulationsList = ({ simList }) => {
    const followLogs = (simulationId) => {
        dispatch({
            type: 'SET_LOGS_ENDPOINT',
            payload: `/api/sim/${simulationId}/logs`,
        })
    }
    return simList && (
        <div className="mt-2 mx-1 action-info-text">
            <table className="w-100">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Logs</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {simList.slice(0, 5).map(simulation => 
                        <tr key={simulation.id}>
                            <td>
                                {simulation.state === "up" && <> <div className="inline-circle inline-circle-green"></div> {formatDuration(simulation.duration)}</>}
                                {simulation.state === "reloading" && <> <div className="inline-circle inline-circle-blue"></div> Reloading</>}
                                {simulation.state === "starting" && <> <div className="inline-circle inline-circle-yellow"></div> Starting </>}
                                {simulation.state.match("stopped") && <> <div className="inline-circle inline-circle-black"></div> {formatDuration(simulation.duration)} </>}
                            </td>
                            <td><button className="link-button" onClick={()=>{followLogs(simulation.id)}} title={simulation.id.slice(20)}>show</button></td>
                            <td>{formatDistanceToNow(new Date(simulation.creationDate))} ago</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SimulationsList;