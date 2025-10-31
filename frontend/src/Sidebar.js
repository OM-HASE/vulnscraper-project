import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-shield-virus"></i>
          <span>VulnScraper</span>
        </div>
        <button className="theme-toggle" id="themeToggle">
          <i className="fas fa-moon"></i>
        </button>
      </div>
      <div className="nav-menu">
        <Link to="/dashboard" className={`nav-item${location.pathname === "/dashboard" ? " active" : ""}`}>
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/vulnerabilities" className={`nav-item${location.pathname === "/vulnerabilities" ? " active" : ""}`}>
          <i className="fas fa-bug"></i>
          <span>Vulnerabilities</span>
        </Link>
        <Link to="/settings" className={`nav-item${location.pathname === "/settings" ? " active" : ""}`}>
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </Link>
        <Link to="/reports" className={`nav-item${location.pathname === "/reports" ? " active" : ""}`}>
          <i className="fas fa-chart-bar"></i>
          <span>Reports</span>
        </Link>
      </div>
    </nav>
  );
}
