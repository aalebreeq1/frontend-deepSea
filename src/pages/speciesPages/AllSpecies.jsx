import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllSpecies } from '../../services/speciesService';
import './AllSpecies.css';

function SpeciesCard({ item, number }) {
    const name = item.commonName || item.scientificName;

    return (
        <article className="species-card">
            <Link className="species-card-frame" to={`/species/${item._id}`} aria-label={`View ${name}`}>
                <div className="species-card-face">
                    <svg className="species-card-lines" viewBox="0 0 360 520" preserveAspectRatio="none" fill="none" aria-hidden="true">
                        <path d="M-30 100C80 190 100-30 220 20S270 230 390 130 M-30 110C80 200 100-20 220 30S270 240 390 140 M-30 120C80 210 100-10 220 40S270 250 390 150 M-30 130C80 220 100 0 220 50S270 260 390 160 M-30 140C80 230 100 10 220 60S270 270 390 170 M-30 150C80 240 100 20 220 70S270 280 390 180" />
                        <path d="M-30 390C100 290 140 550 260 410S290 320 390 350 M-30 400C100 300 140 560 260 420S290 330 390 360 M-30 410C100 310 140 570 260 430S290 340 390 370 M-30 420C100 320 140 580 260 440S290 350 390 380 M-30 430C100 330 140 590 260 450S290 360 390 390 M-30 440C100 340 140 600 260 460S290 370 390 400" />
                    </svg>
                    <div className="species-card-brand">
                        <span>DEEPSEA<span className="species-brand-dot">.</span></span>
                        <span>SPECIES / {String(number).padStart(3, '0')}</span>
                    </div>
                    <div className="species-card-title">
                        <h2 className="species-card-name">{name}</h2>
                        <p className="species-card-scientific">{item.scientificName}</p>
                    </div>
                    <img
                        className="species-card-image"
                        src={item.image}
                        alt={name}
                    />
                    <div className="species-card-category">
                        <span>{item.classification || 'Unclassified'}</span>
                    </div>
                    <p className="species-card-description">{item.description}</p>
                    <div className="species-card-footer">EXPEDITION FIELD GUIDE</div>
                </div>
            </Link>
        </article>
    );
}

function AllSpecies() {
    const [species, setSpecies] = useState([]);
    const [classification, setClassification] = useState('All');

    useEffect(() => {
        let cancelled = false;

        async function fetchSpecies() {
            try {
                const data = await getAllSpecies();
                if (!Array.isArray(data)) {
                    throw new Error('Invalid species response');
                }
                if (!cancelled) setSpecies(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchSpecies();
        return () => { cancelled = true; };
    }, []);

    const classifications = [...new Set(species.map(item => item.classification).filter(Boolean))];
    const visibleSpecies = species.filter(item => classification === 'All' || item.classification === classification);

    return (
        <main className="species-collection">
            <div className="species-page-content">
                <header className="species-page-header">
                    <p className="species-eyebrow">DEEPSEA / SPECIES COLLECTION</p>
                    <h1>Life below the <span>surface.</span></h1>
                    <p className="species-intro">Meet the remarkable life that makes our oceans worth exploring.</p>
                    <Link className="species-create-link" to="/create-species">Create species <span aria-hidden="true">+</span></Link>
                </header>

                <section className="species-toolbar" aria-label="Collection controls">
                    <span className="species-collection-label">Your collection ({species.length})</span>
                    <div className="species-filters">
                        <label>
                            <span className="species-visually-hidden">Classification</span>
                            <select value={classification} onChange={event => setClassification(event.target.value)}>
                                <option value="All">All classifications</option>
                                {classifications.map(value => <option key={value} value={value}>{value}</option>)}
                            </select>
                        </label>
                    </div>
                </section>

                <div className="species-section-heading">
                    <h2>Ocean discoveries</h2>
                    <p aria-live="polite">{visibleSpecies.length} species</p>
                </div>
                {visibleSpecies.length > 0 ? (
                    <div className="species-card-grid">
                        {visibleSpecies.map((item, index) => (
                            <SpeciesCard key={item._id} item={item} number={index + 1} />
                        ))}
                    </div>
                ) : (
                    <div className="species-message">
                        <h2>{species.length === 0 ? 'No species have been added yet.' : 'No species match this classification.'}</h2>
                        {species.length > 0 && (
                            <button type="button" onClick={() => setClassification('All')}>Clear filter</button>
                        )}
                    </div>
                )}


                <footer className="species-page-footer">Explore. Discover. Protect.</footer>
            </div>
        </main>
    );
}

export default AllSpecies;
