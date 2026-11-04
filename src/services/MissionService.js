import api from './api'

export async function getAllMissions() {
    const response = await api.get('/mission');
    return response.data.missions;
}

export async function getMissionById(id) {
    const response = await api.get(`/mission/${id}`);
    return response.data.mission;
}

export async function createMission(missionData){
    const response = await api.post('/mission', missionData);
    return response.data.mission;
}

export async function updateMission(id, missionData){
    const response = await api.put(`/mission/${id}`, missionData);
    return response.data.mission;
}

export async function deleteMission(id){
    const response = await api.delete(`/mission/${id}`);
    return response.data.mission;
}

export async function updateMissionState(id, state){
    const response = await api.patch(`/mission/${id}/state`, { state });
    return response.data.mission;
}