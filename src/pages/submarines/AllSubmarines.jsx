import { useState, useEffect } from 'react';
import { getAllSubmarines } from '../../services/submarineService';
import { Link } from 'react-router';
import { Button } from "@heroui/react";
import RecordFormModal from "../../components/RecordFormModal";
import './AllSubmarines.css';

function formatStatus(value) {
    return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function AllSubmarines({ user }) {
    const [showCreate, setShowCreate] = useState(false);
    const canCreate = ["admin", "visitor"].includes(user?.role);
    const [submarines, setSubmarines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [index, setIndex] = useState(0);
    const [photo, setPhoto] = useState(0);

    useEffect(() => {
        let active = true;

        async function fetchSubmarines() {
            try {
                const data = await getAllSubmarines();
                if (active) setSubmarines(data.submarines);
            } catch (err) {
                if (active) {
                    setError(err.response?.data?.message ||
                        'Failed to load submarines. Please try again later.');
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchSubmarines();

        return () => {
            active = false;
        };
    }, []);

    const total = submarines.length;
    const current = submarines[index];

    const photos = current?.images?.length
        ? current.images
        : current?.image
            ? [current.image]
            : [];

    function goTo(i) {
        setIndex(i);
        setPhoto(0);
    }

    function prev() {
        goTo((index - 1 + total) % total);
    }

    function next() {
        goTo((index + 1) % total);
    }

    function prevPhoto() {
        setPhoto((p) => (p - 1 + photos.length) % photos.length);
    }

    function nextPhoto() {
        setPhoto((p) => (p + 1) % photos.length);
    }

    return (
        <section className="submarines-page">

            <header className="sub-hero">
                <div className="sub-hero-overlay" />
                <div className="sub-hero-content">
                    <h1 className="sub-hero-title">DeepSea</h1>
                    <p className="sub-hero-subtitle">Submarines</p>
                </div>
                <a className="sub-scroll-cue" href="#submarine-list">
                    <span className="sub-scroll-arrow">↓</span>
                    Scroll down
                </a>
            </header>

            <div className="sub-section" id="submarine-list">
                <h2 className="sub-section-title">Our submarines</h2>

                {loading ? (
                    <p role="status" className="sub-message">Loading submarines...</p>
                ) : error ? (
                    <p role="alert" className="sub-message error">{error}</p>
                ) : total === 0 ? (
                    <p className="sub-message">No submarines currently registered.</p>
                ) : (
                    <>
                        <div className="sub-showcase">
                            <button className="sub-arrow" onClick={prev} aria-label="Previous">‹</button>

                            <div className="sub-slide" key={current._id}>
                                <div className="sub-media">
                                    {photos[photo] && <img src={photos[photo]} alt={current.name} />}

                                    {photos.length > 1 && (
                                        <>
                                            <button className="sub-gallery-btn left" onClick={prevPhoto} aria-label="Previous photo">‹</button>
                                            <button className="sub-gallery-btn right" onClick={nextPhoto} aria-label="Next photo">›</button>
                                            <span className="sub-gallery-count">{photo + 1} / {photos.length}</span>
                                        </>
                                    )}
                                </div>

                                <div className="sub-info">
                                    <h3 className="sub-name">{current.name}</h3>
                                    <p className="sub-model">{current.model}</p>
                                    <span className={`sub-status ${current.status}`}>
                                        {formatStatus(current.status)}
                                    </span>
                                    {current.description && (
                                        <p className="sub-description">{current.description}</p>
                                    )}

                                    <div className="sub-meta">
                                        <div>
                                            <span>Model</span>
                                            <strong>{current.model}</strong>
                                        </div>
                                        <div>
                                            <span>Max depth</span>
                                            <strong>{current.maxDepth} m</strong>
                                        </div>
                                        <div>
                                            <span>Capacity</span>
                                            <strong>{current.capacity}</strong>
                                        </div>
                                    </div>

                                    <Link className="sub-btn" to={`/submarines/${current._id}`}>
                                        Details
                                    </Link>
                                </div>
                            </div>

                            <button className="sub-arrow" onClick={next} aria-label="Next">›</button>
                        </div>

                        <div className="sub-dots">
                            {submarines.map((item, i) => (
                                <button
                                    key={item._id}
                                    className={`sub-dot ${i === index ? 'active' : ''}`}
                                    onClick={() => goTo(i)}
                                    aria-label={`Show ${item.name}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {canCreate && (
                    <div className="sub-create-row">
                        <Button className="sub-create-btn" isDisabled={loading} onPress={() => setShowCreate(true)}>
                            + Create Submarine
                        </Button>
                    </div>
                )}

                {canCreate && showCreate && (
                    <RecordFormModal
                        kind="submarine"
                        user={user}
                        onClose={() => setShowCreate(false)}
                        onSaved={(submarine) => {
                            setSubmarines((previous) => [...previous, submarine]);
                            setError(null);
                        }}
                    />
                )}
            </div>

        </section>
    );
}

export default AllSubmarines;