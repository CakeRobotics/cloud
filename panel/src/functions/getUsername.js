import axios from 'axios';

// TODO: cache

const getUsername = async function() {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post('/api/auth/validate', { token });
    const username = response.data.username;
    return username;
};

export default getUsername;
