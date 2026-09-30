import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <Link to="/" className="register-logo">SmartBook</Link>

        <div className="register-heading">
          <span>GET STARTED</span>
          <h1>Create your account</h1>
          <p>Set up your account to start managing appointments.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" placeholder="Cuneyt Emre" value={formData.name} onChange={handleChange} autoComplete="name" required />

          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="At least 8 characters" value={formData.password} onChange={handleChange} autoComplete="new-password" required minLength="8" />

          {error && <div className="register-error">{error}</div>}

          <button className="register-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="login-link">Already have an account? <Link to="/login">Log in</Link></p>
        <Link to="/" className="back-home">Back to home</Link>
      </div>
    </div>
  );
}

export default Register;
