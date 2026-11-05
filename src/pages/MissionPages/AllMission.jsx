import { useEffect, useState } from "react";
import { getAllMissions } from "../../services/MissionService";

function AllMission() {
    const [missions, setMissions] = useState([])

    async function fetchMissions() {
        const data = await getAllMissions();
        setMissions(data);
    }
    useEffect(() => {
        fetchMissions();
    }, [])
    return (
        <div>
            <h2>All Missions</h2>
        {missions.length === 0 && (
            <p>No missions found</p>
        )}
            <ul>
                {missions.map((mission) => (
                    <h4 key={mission.id}>{mission.name}</h4>
                ))}
            </ul>

        </div>
    )
}

export default AllMission