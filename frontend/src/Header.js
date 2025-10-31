import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // <-- Import useNavigate

export default function Header({ onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();  // <-- Initialize navigate

  const now = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-center">
        <h1 className="page-title">Dashboard</h1>
      </div>
      <div className="header-right">
        <div className="current-time">{now}</div>
        <div className="user-profile" ref={menuRef}>
          <button
            className="user-profile-btn"
            onClick={() => setOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              color: "#00687d",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "1rem"
            }}
          >
            <i className="fas fa-user-circle" style={{ fontSize: "1.3rem", marginRight: 6 }}></i>
            <span>Admin</span>
            <i className="fas fa-caret-down" style={{ marginLeft: 6 }}></i>
          </button>
          {open && (
            <div className="dropdown-menu">
              <button className="dropdown-item">User Profile</button>
              {/* On click navigate to Homepage */}
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate('/');  // Navigate to homepage
                  setOpen(false);
                }}
              >
                Homepage
              </button>
              <button className="dropdown-item">Help</button>
              <button className="dropdown-item" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
