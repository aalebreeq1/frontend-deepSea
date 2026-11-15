import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllMissions } from '../../services/MissionService';
import { Button } from "@heroui/react";
import RecordFormModal from "../../components/RecordFormModal";
import "./AllMission.css";

function AllMission({ user }) {
    const [showCreate, setShowCreate] = useState(false);
    const canCreate = ["admin", "researcher"].includes(user?.role);

    const [missions, setMissions] = useState([]);
    const [index, setIndex] = useState(0);

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
                    console.error(err);
                }
            }
        };

        fetchMissions();

        return () => {
            active = false;
        };
    }, []);

    const total = missions.length;
    const current = missions[index];

    function prev() {
        setIndex((previous) => (previous - 1 + total) % total);
    }

    function next() {
        setIndex((previous) => (previous + 1) % total);
    }

    return (
        <main className="missions-page">
            <header className="mission-hero">
                <div className="mission-hero-overlay" />
                <div className="mission-hero-content">
                    <h1>Missions</h1>
                    <p>Of DeepSea</p>
                </div>
                <a className="mission-scroll-cue" href="#mission-list">
                    <span aria-hidden="true">↓</span>
                    Scroll down
                </a>
            </header>

            <section className="mission-section" id="mission-list" aria-labelledby="mission-list-title">
                <h2 className="mission-section-title" id="mission-list-title">Explore our expeditions</h2>

                {total === 0 ? (
                    <p className="mission-message">No missions found. Our next expedition starts here.</p>
                ) : (
                    <>
                        <div className="mission-showcase">
                            {total > 1 && (
                                <button type="button" className="mission-arrow" onClick={prev} aria-label="Previous mission">‹</button>
                            )}

                            <article className="mission-slide" key={current._id} aria-live="polite">
                                <div className="mission-media">
                                    <img
                                        src={current.submarine?.image || '/images/ocean.jpg'}
                                        alt={current.submarine?.image ? current.submarine.name : 'Sunlight beneath the ocean surface'}
                                    />
                                    <p className="mission-media-caption">
                                        {current.submarine?.name || 'DeepSea expedition'}
                                    </p>
                                </div>

                                <div className="mission-info">
                                    <span className="mission-number">Expedition / {String(index + 1).padStart(3, '0')}</span>
                                    <h3>{current.title}</h3>
                                    <span className={`mission-status ${current.status}`}>{current.status}</span>
                                    <p className="mission-objective">{current.objective}</p>

                                    <dl className="mission-meta">
                                        <div>
                                            <dt>Location</dt>
                                            <dd>{current.location?.name || 'Not assigned'}</dd>
                                        </div>
                                        <div>
                                            <dt>Submarine</dt>
                                            <dd>{current.submarine?.name || 'Not assigned'}</dd>
                                        </div>
                                        <div>
                                            <dt>Start date</dt>
                                            <dd>{current.startDate?.split('T')[0] || 'Not scheduled'}</dd>
                                        </div>
                                        <div>
                                            <dt>End date</dt>
                                            <dd>{current.endDate?.split('T')[0] || 'Not scheduled'}</dd>
                                        </div>
                                    </dl>

                                    <Link className="mission-details-link" to={`/mission/${current._id}`}>
                                        Details <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </article>

                            {total > 1 && (
                                <button type="button" className="mission-arrow" onClick={next} aria-label="Next mission">›</button>
                            )}
                        </div>

                        {total > 1 && (
                            <div className="mission-dots" aria-label="Choose a mission">
                                {missions.map((mission, i) => (
                                    <button
                                        type="button"
                                        key={mission._id}
                                        className={`mission-dot ${i === index ? 'active' : ''}`}
                                        onClick={() => setIndex(i)}
                                        aria-label={`Show ${mission.title}`}
                                        aria-current={i === index ? 'true' : undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {canCreate && (
                    <div className="mission-create-row">
                        <Button className="mission-create-button" onPress={() => setShowCreate(true)}>
                            + Create Mission
                        </Button>
                    </div>
                )}
            </section>

            {canCreate && showCreate && (
                <RecordFormModal
                    kind="mission"
                    user={user}
                    onClose={() => setShowCreate(false)}
                    onSaved={(mission) => {
                        setMissions((previous) => [...previous, mission]);
                        setIndex(missions.length);
                    }}
                />
            )}
        </main>
    );
}

export default AllMission;
