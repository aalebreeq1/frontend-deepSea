import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { getMissionById } from "../../services/MissionService";
function MissionDetails() {
    const [mission, setMission] = useState(null);
    const { id } = useParams();

    async function fetchMission() {
        const data = await getMissionById(id);
        setMission(data);
    }
    useEffect(() => {
        fetchMission();
    }, [id]);
    return (
        <div>
            <h2>Mission Details</h2>
            {mission ? (
                <div>
                    <p>Title: {mission.title}</p>
                    <p>Objective: {mission.objective}</p>
                    <p>Start Date: {mission.startDate}</p>
                    <p>End Date: {mission.endDate}</p>
                    <p>Status: {mission.status}</p>
                    <p>Submarine: {mission.submarine}</p>
                    <p>Location: {mission.location}</p>
                    <p>mission Researchers:</p>
                    {mission.researchers && mission.researchers.map((researcher, index) => (
                        <p key={index}>{researcher}</p>
                    ))}
                    <p>Equipment:</p>
                    {mission.equipment && mission.equipment.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))}

                </div>
            ) : (
                <p>Loading mission details...</p>
            )}
        </div>
    )
}

export default MissionDetails