import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StaffSideBar from '../components/StaffSideBar.jsx';
import { FaBars } from 'react-icons/fa';
import Notifications from "../../components/Notifications";

export default function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Hamburger toggle button for mobile */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        style={{
          display: 'block',
          position: 'fixed',
          top: '15px',
          left: sidebarOpen ? '265px' : '15px',
          zIndex: 1001,
          background: '#343a40',
          color: 'white',
          border: 'none',
          padding: '10px 12px',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'left 0.3s ease'
        }}
      >
        <FaBars size={20} />
      </button>

      {/* Notifications Bell - Fixed position top right */}
      <div style={{
        position: 'fixed',
        top: '15px',
        right: '20px',
        zIndex: 1002,
      }}>
        <Notifications />
      </div>

      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <StaffSideBar onToggle={setSidebarOpen} isOpen={sidebarOpen} onToggleCallback={toggleSidebar} />
        
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 999,
              display: 'none'
            }}
          />
        )}
        
        <main
          style={{
            flex: 1,
            padding: "20px",
            marginLeft: sidebarOpen ? "250px" : "70px",
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
            width: "100%",
            maxWidth: "100%"
          }}
          className="main-content"
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

