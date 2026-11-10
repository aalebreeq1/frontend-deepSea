import { useState, useEffect } from 'react'
import { getAllEquipments } from "../../services/equipmentServices"
import { Link } from 'react-router'
import './AllEquipment.css'

function formatCondition(value) {
    return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

function AllEquipments() {
    const [equipment, setEquipment] = useState([])
    const [index, setIndex] = useState(0)

    useEffect(() => {
        async function loadEquipment() {
            const response = await getAllEquipments()
            setEquipment(response)
        }

        loadEquipment()
    }, [])

    const total = equipment.length
    const current = equipment[index]

    function prev() {
        setIndex((i) => (i - 1 + total) % total)
    }

    function next() {
        setIndex((i) => (i + 1) % total)
    }

    return (
        <section className="equipments-page">

            <header className="hero">
                <div className="hero-overlay" />
                <div className="hero-content">
                    <h1 className="hero-title">Equipment</h1>
                    <p className="hero-subtitle">Of DeepSea</p>
                </div>
                <a className="scroll-cue" href="#equipment-list">
                    <span className="scroll-arrow">↓</span>
                    Scroll down
                </a>
            </header>

            <div className="equipment-section" id="equipment-list">
                <h2 className="section-title">Tracked on our expeditions</h2>

                {total > 0 && current && (
                    <div className="showcase">
                        <button className="showcase-arrow" onClick={prev} aria-label="Previous">‹</button>

                        <div className="showcase-slide" key={current._id}>
                            <div className="showcase-media">
                                {current.image && <img src={current.image} alt={current.name} />}
                            </div>

                            <div className="showcase-info">
                                <span className="card-category">{current.category}</span>
                                <h3 className="showcase-name">{current.name}</h3>
                                <span className={`status-pill ${current.condition}`}>
                                    {formatCondition(current.condition)}
                                </span>
                                {current.description && (
                                    <p className="showcase-description">{current.description}</p>
                                )}
                                <Link className="card-btn" to={`/equipments/${current._id}`}>
                                    Details
                                </Link>
                            </div>
                        </div>

                        <button className="showcase-arrow" onClick={next} aria-label="Next">›</button>
                    </div>
                )}

                <div className="showcase-dots">
                    {equipment.map((item, i) => (
                        <button
                            key={item._id}
                            className={`dot ${i === index ? 'active' : ''}`}
                            onClick={() => setIndex(i)}
                            aria-label={`Show ${item.name}`}
                        />
                    ))}
                </div>
            </div>

        </section>
    )
}

export default AllEquipments