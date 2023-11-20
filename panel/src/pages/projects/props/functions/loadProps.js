import axios from 'axios';
import { dispatch, getState } from '../../../../redux/store';

const loadProps = async function() {
    const state = await getState();
    const username = state.username;
    const projectName = state.projects.current.name;

    const token = localStorage.getItem('auth_token');
    const response = await axios.get(
        `/api/projects/${username}/${projectName}/props.json`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const props = response.data;

    dispatch({
        type: 'SET_PROPS',
        payload: props,
    })
}

export default loadProps;
