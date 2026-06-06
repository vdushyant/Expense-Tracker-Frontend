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
    <div className="page-container">
      <div className="auth-card">
        <h2>Login</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
            />
          </div>

          <button type="submit" className="primary-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;