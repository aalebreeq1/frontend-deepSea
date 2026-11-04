import api from "./api"

export async function getAllSubmarines(){
    const response = await api.get('/submarine');
    return response.data;
}

export async function getSubmarineById(id){
    const response = await api.get(`/submarine/${id}`);
    return response.data;
}

export async function createSubmarine(submarineData){
    const response = await api.post('/submarine', submarineData);
    return response.data;
}

export async function updateSubmarine(id, submarineData){
    const response = await api.put(`/submarine/${id}`, submarineData);
    return response.data;
}

export async function deleteSubmarine(id){
    const response = await api.delete(`/submarine/${id}`);
    return response.data;
}

export async function updateSubmarineState(id, state){
    const response = await api.patch(`/submarine/${id}/state`, { state });
    return response.data;
}