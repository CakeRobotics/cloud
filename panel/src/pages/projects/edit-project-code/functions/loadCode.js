import axios from 'axios';
import getUsername from '../../../../functions/getUsername';

const loadCode = async function(app) {
    const username = await getUsername()
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(
        `/api/apps/${username}/${app}/code`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const code = response.data.code;
    return code;
}

export default loadCode;
