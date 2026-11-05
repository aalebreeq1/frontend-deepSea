import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllMissions } from '../../services/MissionService';

function AllMission() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const fetchMissions = async () => {
            try {
                const data = await getAllMissions();
                if (active) setMissions(data);
            } catch (err) {
                if (!active) return;

                const isEmpty =
                    err.response?.status === 404 &&
                    err.response?.data?.message === 'No missions found';

                if (!isEmpty) {
                    setError(
                        err.response?.data?.error ||
                        err.response?.data?.message ||
                        'Failed to load missions.'
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchMissions();

        return () => {
            active = false;
        };
    }, []);

    return (
        <div>
            <h1>All Missions</h1>
            <Link to="/create-mission">Create Mission</Link>

            {loading ? (
                <p>Loading missions...</p>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : missions.length === 0 ? (
                <p>No missions found.</p>
            ) : (
                <ul>
                    {missions.map((mission) => (
                        <li key={mission._id}>
                            <Link to={`/mission/${mission._id}`}>
                                {mission.title}
                            </Link>
                            <p>Status: {mission.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AllMission;