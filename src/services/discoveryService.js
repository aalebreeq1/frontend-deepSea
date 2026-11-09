import api from './api'

export async function getAllDiscoveries() {
    const response = await api.get('/discovery');
    return response.data;
}

export async function getDiscoveryById(id) {
    const response = await api.get(`/discovery/${id}`);
    return response.data;
}
export async function createDiscovery(discoveryData){
    const response = await api.post('/discovery', discoveryData);
    return response.data;
}

export async function updateDiscovery(id, discoveryData){
    const response = await api.put(`/discovery/${id}`, discoveryData);
    return response.data;
}

export async function deleteDiscovery(id){
    const response = await api.delete(`/discovery/${id}`);
    return response.data;
}


