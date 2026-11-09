import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllMissions } from '../../services/MissionService';
import { Button } from "@heroui/react";
import RecordFormModal from "../../components/RecordFormModal";

function AllMission({ user }) {
    const [showCreate, setShowCreate] = useState(false);
    const canCreate = ["admin", "visitor"].includes(user?.role);

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
                const isEmpty =
                    err.response?.status === 404 &&
                    err.response?.data?.message === 'No missions found';

                if (active && !isEmpty) {
                    setError('Failed to load missions. Please try again later.');
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
            {canCreate && (
                <Button
                    isDisabled={loading}
                    onPress={() => setShowCreate(true)}
                >
                    Create Mission
                </Button>
            )}

            {canCreate && showCreate && (
                <RecordFormModal
                    kind="mission"
                    user={user}
                    onClose={() => setShowCreate(false)}
                    onSaved={(mission) => {
                        setMissions((previous) => [...previous, mission]);
                        setError('');
                    }}
                />
            )}

            {loading ? (
                <p role="status">Loading missions...</p>
            ) : error ? (
                <p role="alert" className="text-danger">{error}</p>
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
