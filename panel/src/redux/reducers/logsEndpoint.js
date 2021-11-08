import initialState from "../initialState";

const logsEndpoint = function(state = initialState.logsEndpoint, action) {
    if (action.type === 'SET_LOGS_ENDPOINT') {
        const logsEndpoint = action.payload;
        return logsEndpoint;
    }
    return state;
}

export default logsEndpoint;
