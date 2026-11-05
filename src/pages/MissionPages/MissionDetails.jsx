import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getMissionById } from '../../services/MissionService';

function MissionDetails() {
    const { id } = useParams();

    const [details, setDetails] = useState({
        id: null,
        mission: null,
        error: '',
    });

    useEffect(() => {
        let active = true;

        const fetchMission = async () => {
            try {
                const data = await getMissionById(id);

                if (active) {
                    setDetails({ id, mission: data, error: '' });
                }
            } catch (err) {
                if (active) {
                    setDetails({
                        id,
                        mission: null,
                        error:
                            err.response?.data?.error ||
                            err.response?.data?.message ||
                            'Failed to load mission details.',
                    });
                }
            }
        };

        fetchMission();

        return () => {
            active = false;
        };
    }, [id]);

    if (details.id !== id) {
        return <p>Loading mission details...</p>;
    }

    if (details.error) {
        return <p role="alert">{details.error}</p>;
    }

    const mission = details.mission;

    if (!mission) {
        return <p>Mission not found.</p>;
    }

    return (
        <div>
            <h1>Mission Details</h1>
            <Link to="/all-missions">Back to missions</Link>

            <h2>{mission.title}</h2>
            <p>Objective: {mission.objective}</p>
            <p>Start Date: {mission.startDate?.slice(0, 10)}</p>
            <p>End Date: {mission.endDate?.slice(0, 10) || 'Not set'}</p>
            <p>Status: {mission.status}</p>
            <p>Submarine: {mission.submarine?.name || 'Unavailable'}</p>
            <p>Location: {mission.location?.name || 'Unavailable'}</p>

            <h3>Mission Researchers</h3>
            {mission.missionResearchers?.length > 0 ? (
                <ul>
                    {mission.missionResearchers.map((researcher) => (
                        <li key={researcher._id}>
                            {researcher.username}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No researchers assigned.</p>
            )}

            <h3>Equipment</h3>
            {mission.equipment?.length > 0 ? (
                <ul>
                    {mission.equipment.map((item) => (
                        <li key={item._id}>{item.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No equipment assigned.</p>
            )}
        </div>
    );
}

export default MissionDetails;