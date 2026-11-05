import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getMissionById, deleteMission, updateMissionState } from '../../services/MissionService';
import { useNavigate } from 'react-router';


function MissionDetails({ user }) {
    const isAdmin = user?.role === 'admin';
    const navigate = useNavigate();
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

        setError('');

        try {
            const updated = await updateMissionState(id, status);

            setMission((previous) => ({
                ...previous,
                status: updated.status,
            }));
        } catch {
            setError('Failed to update mission status.');
        }
    };
    return (
        <div>
            <h1>Mission Details</h1>
            <Link to="/all-missions">Back to missions</Link>
            <div>
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
            <p>Start Date: {mission.startDate}</p>
            <p>End Date: {mission.endDate}</p>
            <p>Status: {mission.status}</p>
            <p>Submarine: {mission.submarine}</p>
            <p>Location: {mission.location}</p>

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