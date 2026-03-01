import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaHistory, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from "../../contexts/AuthContext";

export default function CustomerSideBar({ onToggle }) {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-primary text-white vh-100 position-fixed transition-all ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        style={{
          width: isOpen ? "280px" : "70px",
          left: 0,
          top: 0,
          zIndex: 1000,
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-light">
          {isOpen && <h5 className="mb-0 fw-bold text-white">Quick</h5>}
          <button
            className="btn btn-link text-white p-0 border-0"
            onClick={toggleSidebar}
            style={{ fontSize: "1.2rem" }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="list-unstyled px-2">
            <li className="mb-2">
              <Link
                to="/customer/dashboard"
                className="d-flex align-items-center text-decoration-none text-white sidebar-link px-3 py-2 rounded"
              >
                <FaHome className="me-3" style={{ fontSize: "1.2rem", minWidth: "20px" }} />
                {isOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/customer/menu"
                className="d-flex align-items-center text-decoration-none text-white sidebar-link px-3 py-2 rounded"
              >
                <FaShoppingCart className="me-3" style={{ fontSize: "1.2rem", minWidth: "20px" }} />
                {isOpen && <span>Order Food</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/customer/orders"
                className="d-flex align-items-center text-decoration-none text-white sidebar-link px-3 py-2 rounded"
              >
                <FaHistory className="me-3" style={{ fontSize: "1.2rem", minWidth: "20px" }} />
                {isOpen && <span>Order History</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/customer/profile"
                className="d-flex align-items-center text-decoration-none text-white sidebar-link px-3 py-2 rounded"
              >
                <FaUser className="me-3" style={{ fontSize: "1.2rem", minWidth: "20px" }} />
                {isOpen && <span>Profile</span>}
              </Link>
            </li>
            
            {/* Logout Button */}
            <li className="mb-2 mt-4">
              <button
                onClick={handleLogout}
                className="d-flex align-items-center text-decoration-none text-white w-100 sidebar-link px-3 py-2 rounded"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                <FaSignOutAlt className="me-3" style={{ fontSize: "1.2rem", minWidth: "20px" }} />
                {isOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {!isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 999 }}
          onClick={toggleSidebar}
        ></div>
      )}

      <style jsx>{`
        .sidebar-link {
          transition: all 0.3s ease;
          position: relative;
        }

        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .sidebar-link:hover::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background-color: #ffc107;
          border-radius: 0 4px 4px 0;
        }

        .sidebar-open {
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-closed {
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .sidebar-open {
            width: 250px !important;
          }

          .sidebar-closed {
            width: 0px !important;
            overflow: hidden;
          }
        }
      `}</style>
    </>
  );
}