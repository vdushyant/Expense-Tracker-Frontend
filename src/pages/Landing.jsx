import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-badge">Personal Finance Made Simple</p>

          <h1>Track expenses. Manage budgets. Stay in control.</h1>

          <p className="hero-description">
            Expense Tracker helps you monitor your spending, manage monthly
            budgets, and understand where your money goes — all in one simple
            dashboard.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-primary-btn">
              Get Started
            </Link>

            <Link to="/login" className="hero-secondary-btn">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Monthly Overview</h3>

          <div className="hero-stat">
            <span>Total Spent</span>
            <strong>₹24,500</strong>
          </div>

          <div className="hero-stat">
            <span>Budget</span>
            <strong>₹35,000</strong>
          </div>

          <div className="hero-stat">
            <span>Remaining</span>
            <strong className="positive">₹10,500</strong>
          </div>

          <div className="hero-progress">
            <div></div>
          </div>

          <p className="hero-note">You are within your monthly budget.</p>
        </div>
      </section>

      <section className="features-section">
        <h2>Everything you need to manage expenses</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Expense CRUD</h3>
            <p>Add, update, delete, and view your daily expenses easily.</p>
          </div>

          <div className="feature-card">
            <h3>Budget Tracking</h3>
            <p>Set monthly budgets and instantly check spending status.</p>
          </div>

          <div className="feature-card">
            <h3>CSV Export</h3>
            <p>Export your expense records for reporting or personal analysis.</p>
          </div>

          <div className="feature-card">
            <h3>Secure Login</h3>
            <p>Your data is protected with JWT-based authentication.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;