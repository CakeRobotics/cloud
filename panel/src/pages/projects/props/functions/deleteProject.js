import axios from 'axios';
import { getState } from '../../../../redux/store';

const deleteProject = async function() {
    const state = await getState();
    const username = state.username;
    const projectName = state.projects.current.name;

    const token = localStorage.getItem('auth_token');
    await axios.delete(
        `/api/projects/${username}/${projectName}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export default deleteProject;
