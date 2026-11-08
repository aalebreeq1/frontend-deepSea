import { Link } from 'react-router'
import "./css/Homepage.css"
import { ArrowRightUp } from 'reicon-react'
import {useEffect, useRef} from 'react'

function Homepage() {
  
  return (
    <main className="homepage">
      <div className="home-journey">
        <section className="home-hero">
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
