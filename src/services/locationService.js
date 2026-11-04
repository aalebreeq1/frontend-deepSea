import api from "./api"


export async function getAllLocations() {
    const response = await api.get('/location')
    return response.data
}

export async function createNewLocation(newLocation) {
    const response = await api.post('/location', newLocation)
    return response.data

}

export async function getLocationById(locationId){
    const response = await api.get(`/location/${locationId}`)
    return response.data
}

export async function updateLocationById(locationId, updatedLocation){
    const response = await api.put(`/location/${locationId}`, updatedLocation)
        return response.data

}

export async function deleteLocationById(locationId){
    const response = await api.delete(`/location/${locationId}`)
    return response.data
}