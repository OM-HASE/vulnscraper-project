import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ onLogout, pageName }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
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
    <>
      <style>{`
        * { box-sizing: border-box; }
        body, html {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #121418;
          color: #cbd3da;
          transition: background-color 0.4s ease, color 0.4s ease;
        }
        body.light-theme, body.light-theme html {
          background-color: #f5f7fa;
          color: #282c34;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #282c34;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: background-color 0.4s ease, color 0.4s ease;
          user-select: none;
        }
        body.light-theme .header {
          background: #ffffff;
          color: #282c34;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header-center { flex-grow: 1; }
        .page-title { font-size: 1.8rem; font-weight: 600; }
        .header-right { display: flex; align-items: center; gap: 1.5rem; }

        .current-time {
          font-weight: 500;
          font-size: 0.9rem;
          color: #9da5b4;
          transition: color 0.4s ease;
        }
        body.light-theme .current-time { color: #666666; }

        .user-profile { position: relative; }
        .user-profile-btn {
          background: none;
          border: none;
          color: #61dafb;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-weight: bold;
          font-size: 1rem;
          gap: 6px;
          transition: color 0.4s ease;
          padding: 0;
          user-select: none;
        }
        .user-profile-btn i {
          font-size: 1.3rem;
          color: #61dafb;
          transition: color 0.4s ease;
          display: block;
        }
        body.light-theme .user-profile-btn { color: #007acc; }
        body.light-theme .user-profile-btn i { color: #007acc; }

        .dropdown-menu {
          position: absolute;
          top: 110%;
          right: 0;
          background-color: #1e222a;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          overflow: hidden;
          min-width: 150px;
          z-index: 1000;
          transition: background-color 0.4s ease;
        }
        body.light-theme .dropdown-menu {
          background-color: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .dropdown-item {
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          color: #cbd3da;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background-color 0.3s ease, color 0.3s ease;
          user-select: none;
        }
        body.light-theme .dropdown-item { color: #282c34; }
        .dropdown-item:hover {
          background-color: #61dafb;
          color: #282c34;
        }
        body.light-theme .dropdown-item:hover {
          background-color: #007acc;
          color: #fff;
        }
      `}</style>

      <header className="header">
        <div className="header-center">
          <h1 className="page-title">{pageName}</h1>
        </div>
        <div className="header-right">
          <div className="current-time">{now}</div>
          <div className="user-profile" ref={menuRef}>
            <button
              className="user-profile-btn"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={open}
              aria-label="User menu toggle"
            >
              <i className="fas fa-user-circle"></i>
              <span>Admin</span>
              <i className="fas fa-caret-down"></i>
            </button>
            {open && (
              <div className="dropdown-menu" role="menu">
                <button className="dropdown-item" role="menuitem">
                  User Profile
                </button>
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    navigate('/');
                    setOpen(false);
                  }}
                >
                  Homepage
                </button>
                <button className="dropdown-item" role="menuitem">
                  Help
                </button>
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    if (onLogout) onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
