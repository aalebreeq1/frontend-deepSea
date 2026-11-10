import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { signIn } from "../services/authService";
import AuthLayout from "../components/AuthLayout";

function SignInPage({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Link to="/" className="auth-back-link">Back to the ocean</Link>
      <p className="auth-eyebrow">YOUR NEXT DISCOVERY AWAITS</p>
      <h1>Welcome back.</h1>
      <p className="auth-intro">
        Sign in to your account and pick up where your curiosity left off.
      </p>

      {location.state?.accountCreated && (
        <p className="auth-success" role="status">
          Your account is ready. Sign in to join the crew.
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit} aria-label="Sign in">
        <div className="auth-field">
          <label htmlFor="signin-username">Username</label>
          <input
            id="signin-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signin-password">Password</label>
          <div className="auth-password">
            <input
              id="signin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button
          className="auth-submit"
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="auth-switch">
        New to Deepsea? <Link to="/sign-up">Create an account</Link>
      </p>
      <p className="auth-footer">DEEPSEA / BEYOND THE SURFACE</p>
    </AuthLayout>
  );
}

export default SignInPage;
