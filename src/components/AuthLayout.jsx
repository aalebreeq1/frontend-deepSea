import { Link } from "react-router";
import "../pages/css/AuthPages.css";

function AuthLayout({ children, signup = false }) {
  return (
    <main className="auth-page">
      <aside className="auth-visual" aria-label="The Deepsea community">
        <img className="auth-ocean-image" src="/images/ocean.jpg" alt="" />
        <div className="auth-visual-shade" />

        <div className="auth-visual-top">
          <Link to="/" className="auth-brand">DEEPSEA<span>.</span></Link>
          <span>FOR THE CURIOUS.</span>
        </div>

        <figure className="auth-quote">
          <p className="auth-quote-label">AN OCEAN OF POSSIBILITIES</p>
          <blockquote>
            {signup
              ? "One crew. A shared curiosity. An ocean of possibilities."
              : "There is a whole world waiting below the surface."}
          </blockquote>
          <figcaption>
            <span className="auth-avatar">
              <span aria-hidden="true">D</span>
              <img
                src="https://www.untitledui.com/images/avatars/pippa-wilkinson?fm=webp&h=144&q=75&w=144"
                alt=""
                width="64"
                height="64"
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
            </span>
            <strong>The Deepsea community</strong>
            <span>Explore. Discover. Protect.</span>
          </figcaption>
        </figure>

        <div className="auth-visual-bottom">
          <span>A DIFFERENT WORLD. A DEEPER PURPOSE.</span>
          <span>BEYOND THE SURFACE</span>
        </div>
      </aside>

      <section className="auth-content" aria-label={signup ? "Sign up" : "Sign in"}>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}

export default AuthLayout;
