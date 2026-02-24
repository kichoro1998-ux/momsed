import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaUtensils,
  FaBoxOpen,
  FaUser,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

export default function StaffSideBar({ onToggle, isOpen = false, onToggleCallback }) {
  // Use internal state if props not provided, or use props
  const [collapsed, setCollapsed] = useState(false);
  const sidebarOpen = isOpen !== undefined ? isOpen : !collapsed;
  
  const toggleSidebar = () => {
    if (onToggleCallback) {
      onToggleCallback();
    } else {
      setCollapsed(!collapsed);
      if (onToggle) onToggle(!collapsed);
    }
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

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
        className="bg-dark text-white transition-all"
        style={{
          width: sidebarOpen ? "250px" : "70px",
          minHeight: "100vh",
          transition: "width 0.3s ease",
          overflow: "visible",
          flexShrink: 0,
          position: 'relative',
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Header */}
        <div 
          className="d-flex align-items-center p-3 border-bottom border-secondary"
          style={{ 
            width: sidebarOpen ? "250px" : "70px",
            justifyContent: sidebarOpen ? "space-between" : "center",
            height: "60px"
          }}
        >
          {sidebarOpen && <h5 className="mb-0 fw-bold text-white">QuickBite Staff</h5>}
          <button
            className="btn btn-link text-white p-0 border-0"
            onClick={toggleSidebar}
            style={{ 
              fontSize: "1.2rem",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              transition: 'transform 0.3s ease'
            }}
          >
            <FaTimes style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="list-unstyled px-2">
            <MenuItem 
              to="/staff/dashboard" 
              icon={<FaHome />} 
              label="Dashboard" 
              sidebarOpen={sidebarOpen} 
            />
            <MenuItem 
              to="/staff/orders" 
              icon={<FaClipboardList />} 
              label="Orders" 
              sidebarOpen={sidebarOpen} 
            />
            <MenuItem 
              to="/staff/menu" 
              icon={<FaUtensils />} 
              label="Menu" 
              sidebarOpen={sidebarOpen} 
            />
            <MenuItem 
              to="/staff/inventory" 
              icon={<FaBoxOpen />} 
              label="Inventory" 
              sidebarOpen={sidebarOpen} 
            />
            <MenuItem 
              to="/staff/profile" 
              icon={<FaUser />} 
              label="Profile" 
              sidebarOpen={sidebarOpen} 
            />
            
            {/* Logout Button */}
            <li className="mb-1 mt-4">
              <button
                onClick={handleLogout}
                className="d-flex align-items-center text-decoration-none text-white w-100"
                style={{
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  padding: sidebarOpen ? "0.75rem 1rem" : "0.75rem",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  margin: "0 4px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer"
                }}
                title="Logout"
              >
                <span style={{ 
                  fontSize: "1.3rem", 
                  minWidth: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ff6b6b"
                }}>
                  <FaSignOutAlt />
                </span>
                {sidebarOpen && (
                  <span style={{ 
                    marginLeft: "12px",
                    whiteSpace: "nowrap",
                    opacity: 1,
                    transition: "opacity 0.2s ease",
                    color: "#ff6b6b"
                  }}>
                    Logout
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

// Menu Item Component
function MenuItem({ to, icon, label, sidebarOpen }) {
  return (
    <li className="mb-1">
      <Link
        to={to}
        className="d-flex align-items-center text-decoration-none text-white"
        style={{
          justifyContent: sidebarOpen ? "flex-start" : "center",
          padding: sidebarOpen ? "0.75rem 1rem" : "0.75rem",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          margin: "0 4px"
        }}
      >
        <span style={{ 
          fontSize: "1.3rem", 
          minWidth: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </span>
        {sidebarOpen && (
          <span style={{ 
            marginLeft: "12px",
            whiteSpace: "nowrap",
            opacity: 1,
            transition: "opacity 0.2s ease"
          }}>
            {label}
          </span>
        )}
      </Link>
    </li>
  );
}

