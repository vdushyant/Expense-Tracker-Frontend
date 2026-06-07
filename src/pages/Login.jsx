import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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

    setMessage("");
    setError("");

    try {
      const response = await loginUser(formData);

      console.log("Login response:", response.data);

      const token = response.data.token;

      login(token);

      setMessage("Login successful.");

      setFormData({
        email: "",
        password: "",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setError(errorMessage);
    }
  }

  return (
    <div className="login-page">
      <div className="login-overlay" />

      <div className="login-shell">
        <section className="login-hero">
          <div className="hero-badge">Smart finance dashboard</div>

          <h1>Take control of your daily spending.</h1>

          <p>
            Track expenses, set monthly budgets, export reports, and understand
            your spending pattern with a clean financial dashboard.
          </p>

          <div className="hero-feature-grid">
            <div className="hero-feature-card">
              <span className="feature-icon">₹</span>
              <div>
                <strong>Expense Tracking</strong>
                <p>Record daily expenses with categories and dates.</p>
              </div>
            </div>

            <div className="hero-feature-card">
              <span className="feature-icon">%</span>
              <div>
                <strong>Budget Monitoring</strong>
                <p>Check monthly budget status and remaining balance.</p>
              </div>
            </div>

            <div className="hero-feature-card">
              <span className="feature-icon">↗</span>
              <div>
                <strong>CSV Reports</strong>
                <p>Export your expense data whenever you need it.</p>
              </div>
            </div>
          </div>

          <div className="login-preview-card">
            <div>
              <span>This Month</span>
              <strong>₹10,500</strong>
              <p>Total tracked expense</p>
            </div>

            <div>
              <span>Budget Used</span>
              <strong>70%</strong>
              <p>Still within safe range</p>
            </div>
          </div>
        </section>

        <section className="login-card-section">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Welcome Back</h2>
              <p>Login to continue managing your expenses and budgets.</p>
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">
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

              <button type="submit" className="primary-btn login-submit-btn">
                Login
              </button>
            </form>

            <p className="login-footer-text">
              Spend smarter. Save better. Stay in control.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
