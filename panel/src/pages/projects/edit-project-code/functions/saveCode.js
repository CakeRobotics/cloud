import axios from 'axios';
import { getState } from '../../../../redux/store';

const saveCode = async function() {
    const state = await getState();
    const username = state.username;
    const projectName = state.projects.current.name;
    const code = state.projects.current.code;

    const token = localStorage.getItem('auth_token');
    await axios.put(
        `/api/projects/${username}/${projectName}/main.py`,
        code,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain; charset=utf-8',
            },
        }
    );
}

export default saveCode;
