import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllSpecies } from '../../services/speciesService';

function SpeciesCard({ item, number }) {
    const [imageError, setImageError] = useState(false);
    const name = item.commonName || item.scientificName;
    const hasImage = Boolean(item.image) && !imageError;

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
                        src={hasImage ? item.image : '/images/ocean.jpg'}
                        alt={hasImage ? name : 'Ocean background; species image unavailable'}
                        onError={() => setImageError(true)}
                        loading="lazy"
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reload, setReload] = useState(0);
    const [search, setSearch] = useState('');
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
            } catch {
                if (!cancelled) setError('We could not load the species collection. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchSpecies();
        return () => { cancelled = true; };
    }, [reload]);

    const classifications = [...new Set(species.map(item => item.classification).filter(Boolean))];
    const searchText = search.trim().toLowerCase();
    const visibleSpecies = species.filter(item => {
        const matchesSearch = `${item.commonName || ''} ${item.scientificName} ${item.classification || ''}`.toLowerCase().includes(searchText);
        return matchesSearch && (classification === 'All' || item.classification === classification);
    });

    function retry() {
        setError('');
        setLoading(true);
        setReload(value => value + 1);
    }

    return (
        <main className="species-collection">
            <div className="species-page-content">
                <header className="species-page-header">
                    <p className="species-eyebrow">DEEPSEA / SPECIES COLLECTION</p>
                    <h1>Life below the <span>surface.</span></h1>
                    <p className="species-intro">Meet the remarkable life that makes our oceans worth exploring.</p>
                    <Link className="species-create-link" to="/create-species">Create species <span aria-hidden="true">+</span></Link>
                </header>

                {error && (
                    <div className="species-message species-error" role="alert">
                        <p>{error}</p>
                        <button type="button" onClick={retry}>Try again</button>
                    </div>
                )}

                {loading ? (
                    <p className="species-message" role="status">Loading the collection…</p>
                ) : !error && (
                    <>
                        <section className="species-toolbar" aria-label="Collection controls">
                            <span className="species-collection-label">Your collection ({species.length})</span>
                            <div className="species-filters">
                                <label>
                                    <span className="species-visually-hidden">Search species</span>
                                    <input type="search" placeholder="Search species…" value={search} onChange={event => setSearch(event.target.value)} />
                                </label>
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
                                    <SpeciesCard
                                        key={item._id}
                                        item={item}
                                        number={index + 1}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="species-message">
                                <h2>{species.length === 0 ? 'No species have been added yet.' : 'No species match your search.'}</h2>
                                {species.length > 0 && (
                                    <button type="button" onClick={() => { setSearch(''); setClassification('All'); }}>Clear filters</button>
                                )}
                            </div>
                        )}
                    </>
                )}

                <footer className="species-page-footer">Explore. Discover. Protect.</footer>
            </div>
            <style>{`
                .species-collection {
                    min-height: 100vh;
                    background: radial-gradient(ellipse at 50% 0, #123d4a66, transparent 55%), #050f19;
                    color: #ecf3f5;
                    font-family: Arial, sans-serif;
                    padding: 72px 6% 32px;
                }
                .species-collection *, .species-collection *::before, .species-collection *::after { box-sizing: border-box; }
                .species-page-content { max-width: 1180px; margin: 0 auto; }
                .species-page-header { text-align: center; margin-bottom: 52px; }
                .species-eyebrow { margin: 0 0 20px; color: #a6e9ec; font-size: 12px; letter-spacing: 3px; }
                .species-page-header h1 { margin: 0; font-size: clamp(36px, 5vw, 62px); font-weight: 500; line-height: 1.15; letter-spacing: -2px; }
                .species-page-header h1 span { color: #a6e9ec; }
                .species-intro { margin: 20px 0 26px; color: #a8bdc9; line-height: 1.7; }
                .species-create-link { display: inline-flex; align-items: center; gap: 24px; min-height: 46px; padding: 12px 20px; border-radius: 7px; background: #a6e9ec; color: #0a2631; font-size: 14px; font-weight: 600; text-decoration: none; }
                .species-create-link:hover { background: #c7f6f7; }
                .species-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 20px 0; border-top: 1px solid #28414f; border-bottom: 1px solid #28414f; }
                .species-collection-label { color: #a6e9ec; font-size: 14px; }
                .species-filters { display: flex; flex-wrap: wrap; gap: 8px; }
                .species-collection button { cursor: pointer; font: inherit; }
                .species-filters input, .species-filters select { width: 100%; min-height: 44px; border: 1px solid #34515e; border-radius: 7px; padding: 10px 12px; background: #0c1e2b; color: #ecf3f5; font: inherit; font-size: 14px; color-scheme: dark; }
                .species-filters input::placeholder { color: #a8bdc9; }
                .species-section-heading { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin: 36px 0 12px; }
                .species-section-heading h2 { margin: 0; font-size: 24px; font-weight: 500; }
                .species-section-heading p { margin: 0; color: #a8bdc9; font-size: 14px; }
                .species-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; padding-top: 24px; }
                .species-card { min-width: 0; position: relative; }
                .species-card-frame {
                    display: block;
                    padding: 9px;
                    border: 1px solid #d1edf1;
                    border-radius: 24px;
                    background:
                        radial-gradient(#ffffffcf 0.6px, transparent 1px) 0 0 / 4px 5px,
                        radial-gradient(#c9e3ffb3 0.5px, transparent 1px) 2px 3px / 7px 6px,
                        linear-gradient(125deg, #e7faff, #b8a7e6 13%, #90edf3 28%, #dcecf3 40%, #a8c4df 54%, #d9a6e8 69%, #8fe4ed 84%, #eafaff);
                    color: #ecf3f5;
                    text-decoration: none;
                    box-shadow: inset 0 0 0 2px #ffffff70, 0 14px 32px #00000070, 0 0 22px #79dbe526;
                }
                .species-card-face { position: relative; isolation: isolate; overflow: hidden; padding: 14px 14px 12px; border: 1px solid #badce59c; border-radius: 16px; background: linear-gradient(130deg, #153a4b, #071e2d 38%, #0a2938 76%, #123746); box-shadow: inset 0 0 0 3px #04111a55; }
                .species-card-face::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(125deg, transparent 12%, #d3f2ff0d 18%, #e9faff14 24%, transparent 31%, transparent 70%, #d8f5ff08 76%, transparent 83%); }
                .species-card-lines { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; stroke: #8ac3ce; stroke-width: 0.6; opacity: 0.36; pointer-events: none; }
                .species-card-brand { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 0 2px 10px; margin-bottom: 10px; border-bottom: 1px solid #93c1cf66; }
                .species-card-brand > span:first-child { color: #f1f7fa; font-size: clamp(17px, 1.9vw, 25px); font-weight: 800; letter-spacing: -0.5px; }
                .species-brand-dot { color: #a6e9ec; }
                .species-card-brand > span:last-child { font-size: clamp(9px, 1vw, 12px); letter-spacing: 1.6px; white-space: nowrap; }
                .species-card-title { padding: 0 2px 12px; }
                .species-card-name { margin: 0; color: #ecf3f5; font-size: clamp(24px, 2.6vw, 36px); font-weight: 600; line-height: 1.15; letter-spacing: -0.7px; overflow-wrap: anywhere; }
                .species-card-scientific { margin: 5px 0 0; color: #e0edf2; font-size: clamp(13px, 1.45vw, 18px); font-style: italic; line-height: 1.4; overflow-wrap: anywhere; }
                .species-card-image { display: block; width: 100%; aspect-ratio: 1.25; object-fit: cover; object-position: center 55%; border: 1px solid #c2e2eab3; border-radius: 15px; background: #051522; }
                .species-card-category { padding: 12px 2px 0; }
                .species-card-category span { display: inline-block; max-width: 100%; padding: 4px 13px; border: 1px solid #a6e9ec; border-radius: 20px; color: #a6e9ec; background: #082332b3; font-size: clamp(9px, 1vw, 12px); font-weight: 600; letter-spacing: 2.5px; line-height: 1.4; text-transform: uppercase; overflow-wrap: anywhere; }
                .species-card-description { min-height: 2.8em; margin: 10px 2px 12px; color: #f0f5f7; font-size: clamp(13px, 1.4vw, 18px); line-height: 1.4; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .species-card-footer { border-top: 1px solid #a6d4df99; padding: 12px 2px 1px; text-align: center; color: #d1eaf1; font-size: clamp(8px, 0.75vw, 10px); letter-spacing: 3px; line-height: 1.4; }
                .species-message { margin: 24px 0; padding: 24px; border: 1px solid #34515e; border-radius: 12px; background: #0c1e2b; color: #c3d1d9; line-height: 1.6; }
                .species-message h2 { font-size: 20px; font-weight: 500; }
                .species-message button { min-height: 44px; margin-top: 12px; padding: 8px 16px; border: 1px solid #77b6c1; border-radius: 7px; color: #a6e9ec; background: transparent; }
                .species-error { border-color: #955b62; }
                .species-page-footer { padding: 64px 0 20px; text-align: center; color: #bdd8e2; font-size: 15px; letter-spacing: 3px; }
                .species-collection :is(a, button, input, select):focus-visible { outline: 2px solid #a6e9ec; outline-offset: 5px; }
                .species-visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
                @media (max-width: 1050px) {
                    .species-toolbar { align-items: flex-start; flex-direction: column; }
                }
                @media (max-width: 850px) {
                    .species-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
                    .species-card-brand > span:first-child { font-size: 21px; }
                    .species-card-brand > span:last-child { font-size: 10px; }
                    .species-card-name { font-size: 28px; }
                    .species-card-scientific { font-size: 15px; }
                    .species-card-description { font-size: 15px; }
                    .species-card-category span { font-size: 10px; }
                }
                @media (max-width: 580px) {
                    .species-collection { padding: 48px 6% 24px; }
                    .species-page-header { margin-bottom: 32px; }
                    .species-eyebrow { font-size: 10px; letter-spacing: 2px; }
                    .species-page-header h1 { letter-spacing: -1px; }
                    .species-filters { width: 100%; }
                    .species-filters label { width: 100%; }
                    .species-card-grid { grid-template-columns: minmax(0, 350px); justify-content: center; }
                    .species-section-heading h2 { font-size: 21px; }
                }
            `}</style>
        </main>
    );
}

export default AllSpecies;
