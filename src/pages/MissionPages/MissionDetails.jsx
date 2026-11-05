import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getMissionById, deleteMission, updateMissionState } from '../../services/MissionService';


function MissionDetails({ user }) {
    const isAdmin = user?.role === 'admin';
    const canEdit = isAdmin || user?.role === 'researcher';
    const navigate = useNavigate();
    const { id } = useParams();

    const [mission, setMission] = useState(null);

    useEffect(() => {
        const fetchMission = async () => {
            try {
                const data = await getMissionById(id);
                setMission(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMission();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteMission(id);
            navigate('/all-missions');
        } catch (err) {
            console.error('Failed to delete mission:', err);
        }
    };
    const handleUpdateState = async (status) => {
        if (!isAdmin) return;

        try {
            const updated = await updateMissionState(id, status);

            setMission((previous) => ({
                ...previous,
                status: updated.status,
            }));
        } catch (err) {
            console.error('Failed to update mission status:', err);
        }
    };

    if (!mission || mission._id !== id) return null;

    return (
        <div>
            <h1>Mission Details</h1>
            <Link to="/all-missions">Back to missions</Link>
            <div>
                {canEdit && (
                    <Link to={`/update-mission/${id}`}>Update Mission</Link>
                )}
                {isAdmin && (
                    <>
                        {mission.status === 'planned' && (
                            <button onClick={() => handleUpdateState('active')}>
                                Start Mission
                            </button>
                        )}

                        {mission.status === 'active' && (
                            <>
                                <button onClick={() => handleUpdateState('suspended')}>
                                    Suspend Mission
                                </button>

                                <button onClick={() => handleUpdateState('completed')}>
                                    Complete Mission
                                </button>
                            </>
                        )}

                        {mission.status === 'suspended' && (
                            <button onClick={() => handleUpdateState('active')}>
                                Resume Mission
                            </button>
                        )}
                    </>
                )}

                <button onClick={handleDelete}>Delete Mission</button>
            </div>

            <h2>{mission.title}</h2>
            <p>Objective: {mission.objective}</p>
            <p>Start Date: {mission.startDate?.split('T')[0]}</p>
            <p>End Date: {mission.endDate?.split('T')[0] || 'Not set'}</p>
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
