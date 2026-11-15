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
import HoldButton from "../../components/reactbits/HoldButton";
import "./MissionDetails.css";

function MissionDetails({ user }) {
    const [showEdit, setShowEdit] = useState(false);
    const isAdmin = user?.role === 'admin';
    const isResearcher = user?.role === 'researcher';
    const canEdit = isAdmin || isResearcher;
    const canDelete = isAdmin;

    const navigate = useNavigate();
    const { id } = useParams();

    const [mission, setMission] = useState(null);

    useEffect(() => {
        async function fetchMission() {
            try {
                const data = await getMissionById(id);
                setMission(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchMission();
    }, [id]);

    const handleDelete = async () => {
        if (!canDelete) return false;

        try {
            await deleteMission(id);
            navigate('/all-missions');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const handleUpdateState = async (status) => {
        if (!canEdit) return;

        try {
            const updated = await updateMissionState(id, status);

            setMission((previous) => ({
                ...previous,
                status: updated.status,
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignment = async (remove = false) => {
        if (!canEdit || !user?._id || !mission) return false;

        try {
            const latestMission = await getMissionById(id);
            const researcherIds = (latestMission.missionResearchers ?? [])
                .map((researcher) => researcher._id ?? researcher)
                .filter((researcherId) => researcherId !== user._id);

            if (!remove) researcherIds.push(user._id);

            await registerMissionReachers(id, researcherIds);
            setMission(await getMissionById(id));
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    if (!mission || mission._id !== id) {
        return (
            <main className="mission-details-page">
                <div className="mission-details-shell">
                    <Link className="mission-detail-back" to="/all-missions">← Back to missions</Link>
                    <div className="mission-detail-notice">
                        <h1>Mission details</h1>
                        <p role="status">Loading mission...</p>
                    </div>
                </div>
            </main>
        );
    }

    const isAssigned = mission.missionResearchers?.some(
        (researcher) => (researcher._id ?? researcher) === user?._id
    ) ?? false;

    return (
        <main className="mission-details-page">
            <div className="mission-details-shell">
                <Link className="mission-detail-back" to="/all-missions">
                    <span aria-hidden="true">←</span> Back to missions
                </Link>

                <header className="mission-detail-heading">
                    <div className="mission-detail-heading-top">
                        <p className="mission-detail-eyebrow">DeepSea / Mission details</p>
                        <span className={`mission-detail-status ${mission.status}`}>{mission.status}</span>
                    </div>
                    <h1>{mission.title}</h1>
                    <p className="mission-detail-location">{mission.location?.name || 'Location not assigned'}</p>
                </header>

                <div className="mission-detail-overview">
                    <figure className="mission-detail-vessel">
                        <img
                            src={mission.submarine?.image || '/images/ocean.jpg'}
                            alt={mission.submarine?.image ? mission.submarine.name : 'Sunlight beneath the ocean surface'}
                        />
                        <figcaption>
                            <p className="mission-detail-eyebrow">Assigned submarine</p>
                            <h2>{mission.submarine?.name || 'Not assigned'}</h2>
                            {mission.submarine?.model && <p className="mission-detail-model">{mission.submarine.model}</p>}
                            {mission.submarine?._id && (
                                <Link to={`/submarines/${mission.submarine._id}`}>
                                    View submarine <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </figcaption>
                    </figure>

                    <section className="mission-detail-brief" aria-labelledby="mission-brief-title">
                        <p className="mission-detail-eyebrow">The expedition</p>
                        <h2 id="mission-brief-title">Mission brief</h2>
                        <p className="mission-detail-objective">{mission.objective}</p>

                        <dl className="mission-detail-facts">
                            <div>
                                <dt>Start date</dt>
                                <dd>{mission.startDate?.split('T')[0] || 'Not scheduled'}</dd>
                            </div>
                            <div>
                                <dt>End date</dt>
                                <dd>{mission.endDate?.split('T')[0] || 'Not scheduled'}</dd>
                            </div>
                            <div>
                                <dt>Location</dt>
                                <dd>
                                    {mission.location?._id ? (
                                        <Link to={`/locations/${mission.location._id}`}>{mission.location.name}</Link>
                                    ) : 'Not assigned'}
                                </dd>
                            </div>
                            <div>
                                <dt>Researchers</dt>
                                <dd>{mission.missionResearchers?.length || 0} assigned</dd>
                            </div>
                        </dl>

                        {(canEdit || canDelete) && (
                            <div className="mission-detail-management">
                                <p className="mission-detail-eyebrow">Manage mission</p>
                                <div className="mission-detail-actions">
                                    {canEdit && (
                                        <Button
                                            className="mission-detail-button mission-detail-primary"
                                            onPress={() => setShowEdit(true)}
                                        >
                                            Edit Mission
                                        </Button>
                                    )}

                                    {canEdit && mission.status === 'planned' && (
                                        <button type="button" className="mission-detail-button" onClick={() => handleUpdateState('active')}>
                                            Start Mission
                                        </button>
                                    )}

                                    {canEdit && mission.status === 'active' && (
                                        <>
                                            <button type="button" className="mission-detail-button" onClick={() => handleUpdateState('suspended')}>
                                                Suspend Mission
                                            </button>
                                            <button type="button" className="mission-detail-button" onClick={() => handleUpdateState('completed')}>
                                                Complete Mission
                                            </button>
                                        </>
                                    )}

                                    {canEdit && mission.status === 'suspended' && (
                                        <button type="button" className="mission-detail-button" onClick={() => handleUpdateState('active')}>
                                            Resume Mission
                                        </button>
                                    )}

                                    {canDelete && (
                                        <HoldButton
                                            className="mission-detail-hold"
                                            backgroundColor="#382222"
                                            fillColor="#c99090"
                                            textColor="#f4c3c3"
                                            fillTextColor="#1b0b0b"
                                            radius={8}
                                            fillDirection="up"
                                            glow={false}
                                            busyLabel="Deleting..."
                                            onHold={handleDelete}
                                        >
                                            delete mission
                                        </HoldButton>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <div className="mission-detail-resources">
                    <section className="mission-detail-panel" aria-labelledby="mission-team-title">
                        <div className="mission-detail-panel-heading">
                            <div>
                                <p className="mission-detail-eyebrow">People behind the expedition</p>
                                <h2 id="mission-team-title">Research team <span>{mission.missionResearchers?.length || 0}</span></h2>
                            </div>
                            {canEdit && (
                                <div className="mission-detail-assignment">
                                    {isAssigned ? (
                                        <>
                                            <span className="mission-detail-assigned">Assigned</span>
                                            <HoldButton
                                                className="mission-detail-hold"
                                                backgroundColor="#12313d"
                                                fillColor="#a6e9ec"
                                                textColor="#a6e9ec"
                                                fillTextColor="#0a2631"
                                                radius={8}
                                                fillDirection="up"
                                                glow={false}
                                                doneLabel="Removed"
                                                busyLabel="Removing..."
                                                onHold={() => handleAssignment(true)}
                                            >
                                                remove me
                                            </HoldButton>
                                        </>
                                    ) : (
                                        <button type="button" className="mission-detail-button" onClick={() => handleAssignment()}>
                                            Assign me to mission
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {mission.missionResearchers?.length > 0 ? (
                            <ul className="mission-detail-list">
                                {mission.missionResearchers.map((researcher) => (
                                    <li key={researcher._id ?? researcher}>
                                        <span className="mission-detail-avatar" aria-hidden="true">{researcher.username?.charAt(0).toUpperCase() || 'R'}</span>
                                        <div>
                                            <h3>{researcher.username || 'Researcher'}</h3>
                                            <p>Mission researcher</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mission-detail-empty">No researchers assigned yet.</p>
                        )}
                    </section>

                    <section className="mission-detail-panel" aria-labelledby="mission-equipment-title">
                        <div className="mission-detail-panel-heading">
                            <div>
                                <p className="mission-detail-eyebrow">Prepared for the deep</p>
                                <h2 id="mission-equipment-title">Equipment <span>{mission.equipment?.length || 0}</span></h2>
                            </div>
                        </div>

                        {mission.equipment?.length > 0 ? (
                            <ul className="mission-detail-list">
                                {mission.equipment.map((item, index) => (
                                    <li key={item._id ?? item}>
                                        {item.image ? (
                                            <img className="mission-detail-equipment-image" src={item.image} alt="" loading="lazy" />
                                        ) : (
                                            <span className="mission-detail-equipment-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                        )}
                                        <div>
                                            <h3>{item.name || 'Equipment'}</h3>
                                            <p>{item.category || 'Mission equipment'}</p>
                                        </div>
                                        {item._id && (
                                            <Link className="mission-detail-item-link" to={`/equipments/${item._id}`} aria-label={`View ${item.name}`}>
                                                View <span aria-hidden="true">→</span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mission-detail-empty">No equipment assigned to this mission.</p>
                        )}
                    </section>
                </div>

                <footer className="mission-detail-footer">DeepSea / Beyond the surface</footer>
            </div>

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
        </main>
    );
}

export default MissionDetails;
