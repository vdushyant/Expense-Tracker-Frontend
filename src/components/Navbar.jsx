import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        ExpenseTracker
      </Link>

      <div className="navbar-links">
        {!isAuthenticated && (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="navbar-cta">
              Get Started
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/budget">Budget</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;