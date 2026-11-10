import { Link } from "react-router";
import SpeciesCardSwap from "./SpeciesCardSwap";
import "../pages/css/AuthPages.css";

function AuthLayout({ children, signup = false }) {
  let formLabel = "Sign in";
  if (signup) formLabel = "Sign up";

  return (
    <main className="auth-page">
      <aside className="auth-visual" aria-label="Discover the Deepsea species">
        <div className="auth-visual-top">
          <Link to="/" className="auth-brand">DEEPSEA<span>.</span></Link>
          <span>FOR THE CURIOUS.</span>
        </div>

        <div className="auth-discoveries">
          <p className="auth-species-eyebrow">A DIFFERENT WORLD. A DEEPER PURPOSE.</p>
          <h2>Meet what lies<br /><span>beneath the surface.</span></h2>
          <p className="auth-discoveries-intro">A closer look at the species in our discoveries.</p>
          <SpeciesCardSwap />
        </div>

        <div className="auth-visual-bottom">
          <span>EXPLORE. DISCOVER. PROTECT.</span>
          <span>BEYOND THE SURFACE</span>
        </div>
      </aside>

      <section className="auth-content" aria-label={formLabel}>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}

export default AuthLayout;
