import { Link } from 'react-router'
import "./css/Homepage.css"
import { ArrowRightUp } from 'reicon-react'
import { useEffect, useRef } from 'react'

function Homepage() {
  const journeyRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const journey = journeyRef.current
    const hero = heroRef.current

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    let frameId

    function updateZoom() {
      if (reducedMotion.matches) {
        hero.style.setProperty("--zoom", "1");
        hero.style.setProperty("--intro-opacity", "1");
        hero.style.setProperty("--intro-visibility", "visible");
        return;
      }

      const journeyTop = journey.getBoundingClientRect().top;

      const scrollDistance =
        journey.offsetHeight - hero.offsetHeight;

      const progress =
        scrollDistance > 0
          ? Math.min(1, Math.max(0, -journeyTop / scrollDistance))
          : 0;

      const zoom = 1 + progress * 4;

      const introOpacity = Math.max(0, 1 - progress * 4);

      hero.style.setProperty("--zoom", String(zoom));

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
          <div className="home-hero-bottom">
            <span>DEEPSEA EXPLORATION</span>
            <span>DEPTH / 000m</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Homepage
