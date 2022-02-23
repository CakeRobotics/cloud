import axios from 'axios';

const loadDevice = async function(owner, deviceName) {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(
        `/api/devices/${owner}/${deviceName}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const device = response.data;
    return device;
}

export default loadDevice;
