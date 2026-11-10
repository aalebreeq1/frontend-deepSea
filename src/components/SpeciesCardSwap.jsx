import { useEffect, useState } from "react";
import { getAllSpecies } from "../services/speciesService";

function SpeciesCardSwap() {
  const [species, setSpecies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSpecies() {
      try {
        const data = await getAllSpecies();
        if (active) setSpecies(data);
      } catch {
        if (active) setError("Species are unavailable right now. You can still sign in.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSpecies();
    return () => { active = false; };
  }, []);

  function nextSpecies() {
    setCurrentIndex((currentIndex + 1) % species.length);
  }

  function previousSpecies() {
    setCurrentIndex((currentIndex - 1 + species.length) % species.length);
  }

  function hideBrokenImage(event) {
    event.currentTarget.style.display = "none";
  }

  if (loading) {
    return <div className="auth-species-message" role="status">Loading species...</div>;
  }

  if (error) {
    return <div className="auth-species-message" role="status">{error}</div>;
  }

  if (species.length === 0) {
    return (
      <div className="auth-species-message">
        <strong>Every discovery starts with curiosity.</strong>
        <p>Species will appear here when they are added to Deepsea.</p>
      </div>
    );
  }

  const cards = [];
  for (let position = 0; position < Math.min(species.length, 3); position++) {
    cards.push(species[(currentIndex + position) % species.length]);
  }

  const currentSpecies = species[currentIndex];

  return (
    <section className="auth-species-swap" aria-label="Species discoveries">
      <div className="auth-species-stack">
        {cards.map((item, position) => (
          <article
            key={item._id}
            className={"auth-species-card auth-species-position-" + position}
            aria-hidden={position !== 0}
          >
            <div className="auth-species-photo">
              <span>THE WORLD BENEATH THE WAVES</span>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.commonName || item.scientificName}
                  onError={hideBrokenImage}
                />
              )}
            </div>
            <div className="auth-species-info">
              <span className="auth-species-classification">{item.classification}</span>
              <h3>{item.commonName || item.scientificName}</h3>
              {item.commonName && <p className="auth-species-scientific">{item.scientificName}</p>}
              <p className="auth-species-description">{item.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="auth-species-controls">
        <button type="button" aria-label="Previous species" onClick={previousSpecies} disabled={species.length === 1}>
          Previous
        </button>
        <span className="auth-species-count" aria-live="polite" aria-atomic="true">
          <span className="auth-screen-reader">{currentSpecies.commonName || currentSpecies.scientificName}, </span>
          {currentIndex + 1} / {species.length}
        </span>
        <button type="button" aria-label="Next species" onClick={nextSpecies} disabled={species.length === 1}>
          Next
        </button>
      </div>
    </section>
  );
}

export default SpeciesCardSwap;
