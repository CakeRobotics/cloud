import axios from 'axios';
import { rawStore } from '../../redux/store';

const ensureUsername = async function() {
    const state = await rawStore.getState();
    const existing_username = state.username;
    if (existing_username) {
        return;
    }

    const token = localStorage.getItem('auth_token');
    const response = await axios.post('/api/auth/validate', { token });
    const username = response.data.username;
    await rawStore.dispatch({
        type: 'SET_USERNAME',
        payload: username,
    });
};

export default ensureUsername;
