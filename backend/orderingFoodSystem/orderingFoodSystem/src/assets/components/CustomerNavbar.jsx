import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUtensils, FaHome, FaShoppingCart, FaHistory, FaUser, FaBars, FaSignOutAlt } from "react-icons/fa";
import Notifications from "../../components/Notifications";
import { useAuth } from "../../contexts/AuthContext";

export default function CustomerNavbar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid px-4">

        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <FaUtensils className="logo-icon" />
          <span className="logo-text">Quick</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <FaBars style={{ color: "#fff" }} />
        </button>

        <div className={`navbar-collapse customer-nav-menu ${mobileOpen ? "d-block" : "d-none d-lg-flex"} justify-content-end`} id="customerNavMenu">
          <ul className="navbar-nav ms-auto gap-lg-3">
            <li className="nav-item">
              <Link
                className={`nav-link custom-link ${location.pathname === "/customer/dashboard" ? "active" : ""}`}
                to="/customer/dashboard"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link custom-link ${location.pathname === "/customer/menu" ? "active" : ""}`}
                to="/customer/menu"
                onClick={() => setMobileOpen(false)}
              >
                Order Food
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link custom-link ${location.pathname === "/customer/orders" ? "active" : ""}`}
                to="/customer/orders"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link custom-link ${location.pathname === "/customer/profile" ? "active" : ""}`}
                to="/customer/profile"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Notifications />
            </li>
            <li className="nav-item">
              <button
                className="nav-link custom-link btn btn-link text-decoration-none"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      {mobileOpen && (
        <div
          className="customer-nav-backdrop d-lg-none"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </nav>
  );
}
