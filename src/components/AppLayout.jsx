import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>ExpenseTracker</h3>
          <p>Finance Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "sidebar-link active" : "sidebar-link"}
          >
            Dashboard
          </Link>

          <Link
            to="/budget"
            className={isActive("/budget") ? "sidebar-link active" : "sidebar-link"}
          >
            Budget
          </Link>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;