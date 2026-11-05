import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllMissions } from '../../services/MissionService';

function AllMission() {
    const [missions, setMissions] = useState([]);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const data = await getAllMissions();
                setMissions(data);
            } catch (err) {
                const isEmpty =
                    err.response?.status === 404 &&
                    err.response?.data?.message === 'No missions found';

                if (!isEmpty) {
                    console.error(err);
                }
            }
        };

        fetchMissions();
    }, []);

    return (
        <div>
            <h1>All Missions</h1>
            <Link to="/create-mission">Create Mission</Link>

            {missions.length === 0 ? (
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
