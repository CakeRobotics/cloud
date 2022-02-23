import axios from 'axios';

const loadDevices = async function() {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(
        `/api/devices/`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const devices = response.data;
    return devices;
}

export default loadDevices;
