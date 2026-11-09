import api from "./api"

export async function getAllEquipments() {
    const response = await api.get('/equipment')
    return response.data
}

export async function createNewEquipment(newEquipment) {
    const response = await api.post('/equipment', newEquipment)
    return response.data
}

export async function getEquipmentById(equipmentId) {
    const response = await api.get(`/equipment/${equipmentId}`)
    return response.data
}

export async function updateEquipment(equipmentId, updatedEquipment) {
    const response = await api.put(`/equipment/${equipmentId}`, updatedEquipment)
    return response.data
}

export async function deleteEquipment(equipmentId) {
    const response = await api.delete(`/equipment/${equipmentId}`)
    return response.data
}

