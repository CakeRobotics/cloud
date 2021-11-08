import axios from 'axios';
import { dispatch, getState } from '../../../../redux/store';

const loadInfo = async function() {
    const state = await getState();
    const username = state.username;
    const projectName = state.projects.current.name;

    const token = localStorage.getItem('auth_token');
    const response = await axios.get(
        `/api/projects/${username}/${projectName}/props.json`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    // FIXME: hack in next two lines
    var info = response.data;
    info.lastChange = new Date();

    dispatch({
        type: 'SET_PROJECT_INFO',
        payload: info,
    })
}

export default loadInfo;
