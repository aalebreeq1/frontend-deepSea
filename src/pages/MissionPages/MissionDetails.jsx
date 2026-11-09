import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
    getMissionById,
    deleteMission,
    updateMissionState,
    registerMissionReachers,
} from '../../services/MissionService';
import { Button } from "@heroui/react";
import RecordFormModal from "../../components/RecordFormModal";

function MissionDetails({ user }) {
    const [showEdit, setShowEdit] = useState(false);
    const isAdmin = user?.role === 'admin';
    const isResearcher = user?.role === 'researcher';
    const canEdit = isAdmin || isResearcher;
    const canDelete = isAdmin || user?.role === 'visitor';

    const navigate = useNavigate();
    const { id } = useParams();

    const [mission, setMission] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchMission = async () => {
            try {
                const data = await getMissionById(id);
                if (active) setMission(data);
            } catch (err) {
                if (active) {
                    setLoadError({
                        id,
                        message: err.response?.data?.message ||
                            'Failed to load this mission.',
                    });
                }
            }
        };

        fetchMission();

        return () => {
            active = false;
        };
    }, [id]);

    const handleDelete = async () => {
        if (!canDelete || pending) return;

        setPending(true);
        setError('');

        try {
            await deleteMission(id);
            navigate('/all-missions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete mission.');
        } finally {
            setPending(false);
        }
    };

    const handleUpdateState = async (status) => {
        if (!canEdit || pending) return;

        setPending(true);
        setError('');

        try {
            const updated = await updateMissionState(id, status);

            setMission((previous) => ({
                ...previous,
                status: updated.status,
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update mission status.');
        } finally {
            setPending(false);
        }
    };

    const handleRegisterResearcher = async () => {
        if (!isResearcher || !user?._id || !mission || pending) return;

        const researcherIds = (mission.missionResearchers ?? []).map(
            (researcher) => researcher._id ?? researcher
        );

        if (researcherIds.includes(user._id)) return;

        setPending(true);
        setError('');

        try {
            await registerMissionReachers(id, [
                ...researcherIds,
                user._id,
            ]);

            const refreshedMission = await getMissionById(id);
            setMission(refreshedMission);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register for this mission.');
        } finally {
            setPending(false);
        }
    };

    if (!mission || mission._id !== id) {
        return (
            <div>
                <Link to="/all-missions">Back to missions</Link>
                {loadError?.id === id ? (
                    <p role="alert" className="text-danger">{loadError.message}</p>
                ) : (
                    <p role="status">Loading mission...</p>
                )}
            </div>
        );
    }

    const isRegistered = mission.missionResearchers?.some(
        (researcher) => (researcher._id ?? researcher) === user?._id
    ) ?? false;

    return (
        <div>
            <h1>Mission Details</h1>

            <Link to="/all-missions">Back to missions</Link>

            {error && <p role="alert" className="text-danger">{error}</p>}
            {pending && <p role="status">Saving changes...</p>}

            <div>
                {canEdit && (
                    <Button isDisabled={pending} onPress={() => setShowEdit(true)}>
                        Edit Mission
                    </Button>
                )}

                {canEdit && showEdit && (
                    <RecordFormModal
                        key={mission._id}
                        kind="mission"
                        user={user}
                        record={mission}
                        onClose={() => setShowEdit(false)}
                        onSaved={setMission}
                    />
                )}

                {isResearcher && (
                    <button
                        onClick={handleRegisterResearcher}
                        disabled={isRegistered || pending}
                    >
                        {isRegistered ? 'Registered' : 'Register'}
                    </button>
                )}

                {canEdit && (
                    <>
                        {mission.status === 'planned' && (
                            <button
                                disabled={pending}
                                onClick={() => handleUpdateState('active')}
                            >
                                Start Mission
                            </button>
                        )}

                        {mission.status === 'active' && (
                            <>
                                <button
                                    disabled={pending}
                                    onClick={() =>
                                        handleUpdateState('suspended')
                                    }
                                >
                                    Suspend Mission
                                </button>

                                <button
                                    disabled={pending}
                                    onClick={() =>
                                        handleUpdateState('completed')
                                    }
                                >
                                    Complete Mission
                                </button>
                            </>
                        )}

                        {mission.status === 'suspended' && (
                            <button
                                disabled={pending}
                                onClick={() => handleUpdateState('active')}
                            >
                                Resume Mission
                            </button>
                        )}
                    </>
                )}

                {canDelete && (
                    <button disabled={pending} onClick={handleDelete}>
                        Delete Mission
                    </button>
                )}
            </div>

            <h2>{mission.title}</h2>

            <p>Objective: {mission.objective}</p>
            <p>Start Date: {mission.startDate?.split('T')[0]}</p>
            <p>End Date: {mission.endDate?.split('T')[0]}</p>
            <p>Status: {mission.status}</p>
            <p>Submarine: {mission.submarine?.name ?? 'Not assigned'}</p>
            <p>Location: {mission.location?.name ?? 'Not assigned'}</p>

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
