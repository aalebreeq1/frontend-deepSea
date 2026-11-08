import { Link } from 'react-router'
import "./css/Homepage.css"
import { ArrowRightUp } from 'reicon-react'
import { useEffect, useRef } from 'react'
import FeaturedMissions from "../components/homepage/FeaturedMissions"
function Homepage() {
  const journeyRef = useRef(null)
  const heroRef = useRef(null)
  const depthRef = useRef(null)

  useEffect(() => {
    const journey = journeyRef.current
    const hero = heroRef.current
    const depthLabel = depthRef.current

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    let frameId

    function updateZoom() {
      if (reducedMotion.matches) {
        hero.style.setProperty("--zoom", "1");
        hero.style.setProperty("--intro-opacity", "1");
        hero.style.setProperty("--intro-visibility", "visible");
        hero.style.setProperty("--submarine-opacity", "1");
        hero.style.setProperty("--welcome-opacity", "0");
        hero.style.setProperty("--welcome-visibility", "hidden");
        depthLabel.textContent = "000";
        return;
      }

      const journeyTop = journey.getBoundingClientRect().top;

      const scrollDistance =
        journey.offsetHeight - hero.offsetHeight;

      const progress =
        scrollDistance > 0
          ? Math.min(1, Math.max(0, -journeyTop / scrollDistance))
          : 0;

      const depth = Math.round(progress * 240)
      depthLabel.textContent = String(depth).padStart(3, '0');
      const zoom = 1 + progress * 4;

      const introOpacity = Math.max(0, 1 - progress * 4);
      const oceanProgress = Math.min(1, Math.max(0, (progress - 0.5) * 2))
      const submarineOpacity = 1 - oceanProgress

      hero.style.setProperty(
        "--welcome-opacity",
        String(oceanProgress)
      )
      hero.style.setProperty(
        "--welcome-visibility",
        oceanProgress === 0 ? "hidden" : "visible"
      )
      hero.style.setProperty(
        "--submarine-opacity",
        String(submarineOpacity)
      );
      hero.style.setProperty("--zoom",
        String(zoom)
      );
      hero.style.setProperty(
        "--intro-opacity",
        String(introOpacity)
      );
      hero.style.setProperty(
        "--intro-visibility",
        introOpacity === 0 ? "hidden" : "visible"
      );
    }
    function requestUpdate() {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(updateZoom)
    }
    updateZoom()

    window.addEventListener("scroll", requestUpdate, { passive: true })

    window.addEventListener("resize", requestUpdate)
    reducedMotion.addEventListener("change", requestUpdate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      reducedMotion.removeEventListener("change", requestUpdate)
    }
  }, [])
  return (
    <main className="homepage">
      <div className="home-journey" ref={journeyRef}>
        <section className="home-hero" ref={heroRef}>
          <img className="home-ocean-background" src='/images/ocean.jpg' alt="" />
          <picture className="home-hero-background">
            <source media="(prefers-reduced-motion: reduce)" srcSet="/images/submarine-still.jpg" />
            <img src="/images/submarine-realistic.gif" alt="" fetchPriority="high" />
          </picture>
          <div className="home-hero-overlay" />
          <div className="home-hero-content">
            <p className="home-eyebrow">
              THE NEXT FRONTIER IS BELOW
            </p>
            <h1>
              Beyond
              <br />
              the <span>surface.</span>
            </h1>
            <p className="home-hero-description">
              A different world. A deeper purpose.
              <br />
              Your next discovery starts here.
            </p>
            <Link to="/all-missions" className="home-primary-link">
              Explore expeditions
              <span aria-hidden="true"><ArrowRightUp size={16} /></span>
            </Link>
          </div>
          <div className="home-ocean-content">
            <p className="home-eyebrow">
              WELCOME TO THE OTHER SIDE
            </p>
            <h2>
              There is a whole world
              <br />
              waiting below
            </h2>
          </div>
          <div className="home-hero-bottom">
            <span>DEEPSEA EXPLORATION</span>
            <span>
              DEPTH / <span ref={depthRef}>000</span>m
            </span>
          </div>
        </section>
      </div>
      <FeaturedMissions />
    </main>
  )
}

export default Homepage
