import axios from 'axios';
import { getState } from '../../../../redux/store';

const saveProps = async function() {
    const state = await getState();
    const username = state.username;
    const projectName = state.projects.current.name;
    const props = state.projects.current.props;

    const token = localStorage.getItem('auth_token');
    await axios.put(
        `/api/projects/${username}/${projectName}/props.json`,
        JSON.stringify(props),
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain; charset=utf-8',
            },
        }
    );
}

export default saveProps;
