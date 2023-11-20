import axios from 'axios';
import { dispatch, getState } from '../../../../redux/store';

const loadCode = async function() {
    const state = await getState();
    const username = state.username;
    const projectName = state.projects.current.name;

    const token = localStorage.getItem('auth_token');
    const response = await axios.get(
        `/api/projects/${username}/${projectName}/main.py`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const code = response.data;

    dispatch({
        type: 'SET_CODE',
        payload: code,
    })
}

export default loadCode;
