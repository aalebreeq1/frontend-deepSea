
import { useState, useEffect } from 'react'
import { getAllLocations } from "../../services/locationServices"
import { Link } from 'react-router'
import { Button } from "@heroui/react"
import RecordFormModal from "../../components/RecordFormModal"
import './AllLocations.css'

function AllLocations({ user }) {
    const [locations, setLocations] = useState([])
    const [index, setIndex] = useState(0)
    const [showCreate, setShowCreate] = useState(false)

    const canCreate = ["admin", "researcher"].includes(user?.role)

    useEffect(() => {
        async function loadLocations() {
            const response = await getAllLocations()
            setLocations(response)
            console.table(
    response.map(location => ({
        name: location.name,
        image: location.image
    }))
)
        }

        loadLocations()
    }, [])

    const total = locations.length
    const current = locations[index]

    function prev() {
        setIndex((i) => (i - 1 + total) % total)
    }

    function next() {
        setIndex((i) => (i + 1) % total)
    }

    return (
        <section className="locations-page">
            <header className="locations-hero">
                <div className="locations-hero-overlay" />

                <div className="locations-hero-content">
                    <h1 className="locations-hero-title">Locations</h1>
                    <p className="locations-hero-subtitle">Of DeepSea</p>
                </div>

                <a className="locations-scroll-cue" href="#location-list">
                    <span className="locations-scroll-arrow">↓</span>
                    Scroll down
                </a>
            </header>

            <div className="locations-section" id="location-list">
                <h2 className="locations-section-title">
                    Explored on our expeditions
                </h2>

                {total > 0 && current && (
                    <div className="locations-showcase">
                        <button
                            className="locations-showcase-arrow"
                            onClick={prev}
                            aria-label="Previous"
                        >
                            ‹
                        </button>

                        <div className="locations-showcase-slide" key={current._id}>
                            <div className="locations-showcase-media">
                                {current.image && (
                                    <img
                                        src={current.image}
                                        alt={current.name}
                                    />
                                )}
                            </div>

                            <div className="locations-showcase-info">
                                <span className="locations-category">
                                    {current.ocean}
                                </span>

                                <h3 className="locations-showcase-name">
                                    {current.name}
                                </h3>

                                <span className="locations-depth-pill">
                                    Depth: {current.depth} m
                                </span>

                                <p className="locations-showcase-description">
                                    Latitude: {current.latitude}
                                    <br />
                                    Longitude: {current.longitude}
                                </p>

                                <Link
                                    className="locations-card-btn"
                                    to={`/locations/${current._id}`}
                                >
                                    Details
                                </Link>
                            </div>
                        </div>

                        <button
                            className="locations-showcase-arrow"
                            onClick={next}
                            aria-label="Next"
                        >
                            ›
                        </button>
                    </div>
                )}

                {total === 0 && (
                    <p className="locations-empty">
                        No locations available.
                    </p>
                )}

                <div className="locations-showcase-dots">
                    {locations.map((item, i) => (
                        <button
                            key={item._id}
                            className={`locations-dot ${i === index ? 'active' : ''}`}
                            onClick={() => setIndex(i)}
                            aria-label={`Show ${item.name}`}
                        />
                    ))}
                </div>

                {canCreate && (
                    <div className="locations-create-row">
                        <Button
                            className="locations-create-btn"
                            onPress={() => setShowCreate(true)}
                        >
                            + Create Location
                        </Button>
                    </div>
                )}

                {canCreate && showCreate && (
                    <RecordFormModal
                        kind="location"
                        user={user}
                        onClose={() => setShowCreate(false)}
                        onSaved={(newLocation) => {
                            setLocations((previous) => [...previous, newLocation])
                            setIndex(locations.length)
                        }}
                    />
                )}
            </div>
        </section>
    )
}

export default AllLocations
