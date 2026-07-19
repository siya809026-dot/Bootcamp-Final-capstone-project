import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        notes.
      </Link>
      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={`navbar-link ${location.pathname === "/dashboard" ? "navbar-link-active" : ""}`}
        >
          dashboard
        </Link>
        <Link
          to="/profile"
          className={`navbar-link ${location.pathname === "/profile" ? "navbar-link-active" : ""}`}
        >
          profile
        </Link>
        <Link to="/logout" className="navbar-link navbar-logout">
          logout
        </Link>
      </div>
    </nav>
  );
}