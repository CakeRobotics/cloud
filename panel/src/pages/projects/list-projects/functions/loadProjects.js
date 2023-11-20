import axios from 'axios';
import { getState } from '../../../../redux/store';

const loadProjects = async function() {
    const { username } = await getState();
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(
        `/api/projects/${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const projects = response.data;
    return projects;
}

export default loadProjects;
