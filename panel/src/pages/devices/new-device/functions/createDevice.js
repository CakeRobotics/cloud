import axios from 'axios';
import { getState } from '../../../../redux/store';

const createDevice = async function(appName) {
    const { username } = await getState();
    const token = localStorage.getItem('auth_token');
    await axios.post(
        `/api/apps/${username}/${appName}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

export default createDevice;
