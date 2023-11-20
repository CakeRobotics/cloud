import { combineReducers } from 'redux';

import logsEndpoint from './logsEndpoint';
import projects from './projects';
import toasts from './toasts';
import username from './username';

const rootReducer = combineReducers({
    logsEndpoint,
    projects,
    toasts,
    username,
});

export default rootReducer;
