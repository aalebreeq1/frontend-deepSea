import { useEffect, useRef, useState } from "react";
import { getAllSpecies } from "../services/speciesService";
import CardSwap, { Card } from "./reactbits/CardSwap";

function SpeciesCardSwap() {
  const swap = useRef(null);
  const [species, setSpecies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paused, setPaused] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

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

  function togglePause() {
    setPaused(!paused);
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

  return (
    <section className="auth-species-swap" aria-label="Species discoveries">
      <div className="auth-species-stack">
        <CardSwap
          ref={swap}
          className="auth-reactbits-swap"
          width={300}
          height={330}
          cardDistance={24}
          verticalDistance={18}
          visibleCards={Math.min(species.length, 3)}
          skewAmount={3}
          delay={4500}
          autoplay={!paused && species.length > 1}
          pauseOnHover
          draggable={species.length > 1}
          parallax={0}
          hoverSpread={0}
          onChange={setCurrentIndex}
        >
          {species.map((item, index) => (
            <Card key={item._id} className="auth-species-card" aria-hidden={index !== currentIndex}>
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
            </Card>
          ))}
        </CardSwap>
      </div>
      {species.length > 1 && (
        <button type="button" className="auth-species-pause" onClick={togglePause} aria-pressed={paused}>
          {paused ? "Play card swap" : "Pause card swap"}
        </button>
      )}
    </section>
  );
}

export default SpeciesCardSwap;
