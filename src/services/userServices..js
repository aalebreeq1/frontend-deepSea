import api from "./api"


export async function getAllUsers(){
    const response = await api.get('/user')
    return response.data
}

export async function createNewUser(newUser){
    const response = await api.post('/user', newUser)
    return response.data
}

export async function getUserById(userId){
    const response = await api.get(`/user/${userId}`)
    return response.data
}

export async function updateUserById(userId, updatedUser){
    const response = await api.put(`/user/${userId}`, updatedUser)
    return response.data
}

export async function deleteUserById(userId){
    const response = await api.delete(`/user/${userId}`)
    return response.data
}