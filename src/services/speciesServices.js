import api from './api'

export async function getAllSpecies() {
    const response = await api.get('/species');
    return response.data;
}

export async function getSpeciesById(id) {
    const response = await api.get(`/species/${id}`);
    return response.data;
}
export async function createSpecies(speciesData){
    const response = await api.post('/species', speciesData);
    return response.data;
}

export async function updateSpecies(id,speciesData ){
    const response = await api.put(`/species/${id}`, speciesData);
    return response.data;
}

export async function deleteSpecies(id){
    const response = await api.delete(`/species/${id}`);
    return response.data;
}


