import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp } from "../services/authService";
import AuthLayout from "../components/AuthLayout";

function SignupPage() {
  const navigate = useNavigate();
  const confirmInput = useRef(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
  });

  function handleChange(event) {
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    if (formData.password !== formData.passwordConf) {
      setError("Your passwords do not match. Please check your confirmation.");
      confirmInput.current?.focus();
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await signUp({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/sign-in", { state: { accountCreated: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout signup>
      <Link to="/" className="auth-back-link">Back to the ocean</Link>
      <p className="auth-eyebrow">A SHARED CURIOSITY STARTS HERE</p>
      <h1>Join the crew.</h1>
      <p className="auth-intro">
        Create your account. There is a whole world waiting below.
      </p>

      <form className="auth-form" onSubmit={handleSubmit} aria-label="Create an account">
        <div className="auth-field">
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <div className="auth-password">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              aria-describedby="signup-password-hint"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting}
              minLength={6}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p id="signup-password-hint" className="auth-field-hint">
            Use at least 6 characters.
          </p>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            ref={confirmInput}
            id="signup-confirm"
            name="passwordConf"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={formData.passwordConf}
            onChange={handleChange}
            disabled={submitting}
            minLength={6}
            required
          />
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button
          className="auth-submit"
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? "Creating your account..." : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already part of the crew? <Link to="/sign-in">Sign in</Link>
      </p>
      <p className="auth-footer">DEEPSEA / BEYOND THE SURFACE</p>
    </AuthLayout>
  );
}

export default SignupPage;
