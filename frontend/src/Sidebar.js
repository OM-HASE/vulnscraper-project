import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const [isLightTheme, setIsLightTheme] = useState(false);

  // On mount, check if the body has light-theme class (optional)
  useEffect(() => {
    if (document.body.classList.contains("light-theme")) {
      setIsLightTheme(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isLightTheme) {
      document.body.classList.remove("light-theme");
      setIsLightTheme(false);
    } else {
      document.body.classList.add("light-theme");
      setIsLightTheme(true);
    }
  };

  return (
    <>
      <style>{`
        /* Base dark theme styles */
        body {
          background-color: #121418;
          color: #cbd3da;
          transition: background-color 0.4s ease, color 0.4s ease;
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body.light-theme {
          background-color: #f5f7fa;
          color: #282c34;
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        .sidebar {
          width: 250px;
          height: 100vh;
          background-color: #282c34;
          color: #cbd3da;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          box-shadow: 2px 0 8px rgba(0,0,0,0.15);
          position: fixed;
          top: 0;
          left: 0;
          overflow-y: auto;
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        body.light-theme .sidebar {
          background-color: #ffffff;
          color: #444444;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          user-select: none;
        }

        .logo {
          display: flex;
          align-items: center;
          font-size: 1.4rem;
          font-weight: 700;
          color: #61dafb;
          gap: 0.5rem;
          transition: color 0.4s ease;
        }

        body.light-theme .logo {
          color: #007acc;
        }

        .logo i {
          font-size: 1.8rem;
        }

        .theme-toggle {
          background: transparent;
          border: none;
          color: #61dafb;
          font-size: 1.4rem;
          cursor: pointer;
          transition: color 0.3s ease;
          padding: 0.2rem;
        }

        .theme-toggle:hover {
          color: #21a1f1;
        }

        body.light-theme .theme-toggle {
          color: #007acc;
        }

        body.light-theme .theme-toggle:hover {
          color: #005a9e;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          color: #cbd3da;
          text-decoration: none;
          font-size: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          transition: background-color 0.3s ease, color 0.3s ease;
          user-select: none;
        }

        body.light-theme .nav-item {
          color: #444444;
        }

        .nav-item i {
          margin-right: 1rem;
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
          color: #61dafb;
          transition: color 0.3s ease;
        }

        body.light-theme .nav-item i {
          color: #007acc;
        }

        .nav-item:hover {
          background-color: #3a3f4b;
          color: #ffffff;
        }

        body.light-theme .nav-item:hover {
          background-color: #e1f0ff;
          color: #007acc;
        }

        .nav-item.active {
          background-color: #61dafb;
          color: #282c34;
          font-weight: 700;
        }

        body.light-theme .nav-item.active {
          background-color: #007acc;
          color: #ffffff;
        }

        .nav-item.active i {
          color: #282c34;
          transition: color 0.3s ease;
        }

        body.light-theme .nav-item.active i {
          color: #ffffff;
        }
      `}</style>

      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-shield-virus"></i>
            <span>VulnScraper</span>
          </div>
          <button
            className="theme-toggle"
            id="themeToggle"
            title="Toggle Theme"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
          >
            <i className={isLightTheme ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>
        </div>
        <div className="nav-menu">
          <Link
            to="/dashboard"
            className={`nav-item${location.pathname === "/dashboard" ? " active" : ""}`}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            to="/dashboard/vulnerabilities"
            className={`nav-item${location.pathname === "/dashboard/vulnerabilities" ? " active" : ""}`}
          >
            <i className="fas fa-bug"></i>
            <span>Vulnerabilities</span>
          </Link>
          <Link
            to="/dashboard/settings"
            className={`nav-item${location.pathname === "/dashboard/settings" ? " active" : ""}`}
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </Link>
          <Link
            to="/dashboard/reports"
            className={`nav-item${location.pathname === "/dashboard/reports" ? " active" : ""}`}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Reports</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
