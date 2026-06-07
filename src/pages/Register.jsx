import { useState } from "react";
import { registerUser } from "../api/authApi";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    console.log("Register button clicked");

    setMessage("");
    setError("");

    try {
      const response = await registerUser(formData);

      setMessage("Registration successful.");
      console.log("Register response:", response.data);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Register error:", err);

      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";

      setError(errorMessage);
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Start managing your expenses with a secure personal account.
        </p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            Register
          </button>
        </form>
      </div>

      <div className="auth-preview">
        <p className="auth-preview-badge">Start tracking today</p>

        <h1>Build better spending habits with every transaction.</h1>

        <p>
          Add expenses, filter by category, set monthly budgets, and get a clear
          view of where your money goes.
        </p>

        <div className="auth-preview-card">
          <div>
            <span>Monthly Budget</span>
            <strong>₹35,000</strong>
          </div>

          <div>
            <span>Remaining</span>
            <strong>₹10,500</strong>
          </div>
        </div>

        <div className="auth-mini-list">
          <span>✓ Personal expense history</span>
          <span>✓ Budget status insights</span>
          <span>✓ Responsive client-ready UI</span>
        </div>
      </div>
    </div>
  </div>
);
}

export default Register;