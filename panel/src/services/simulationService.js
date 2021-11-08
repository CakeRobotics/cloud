import axios from 'axios';

const createSimulation = async ({ projectId, world }) => {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.post('/api/sim/', { projectId, world }, { headers });
    const { simulationId } = response.data;
    return simulationId;
}

const getAll = async (projectId) => {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    const params = { projectId };
    const response = await axios.get('/api/sim/', { params , headers });
    return response.data;
}

const stopSimulation = async (simulationId) => {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post(`/api/sim/${simulationId}/stop`, {}, { headers });
}

const hotReload = async (simulationId) => {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post(`/api/sim/${simulationId}/hotreload`, {}, { headers });
}

const all = {
    createSimulation,
    getAll,
    hotReload,
    stopSimulation,
};

export default all;