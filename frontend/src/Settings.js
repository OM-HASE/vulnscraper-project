import React from "react";

export default function Settings() {
  return (
    <>
      <style>{`
        /* General body and font */
        * {
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f7fa;
          color: #333;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #282c34;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 600;
        }

        .current-time {
          font-weight: 500;
          font-size: 0.9rem;
          margin-right: 1.5rem;
          color: #9da5b4;
        }

        .user-profile {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
        }

        .user-profile i {
          font-size: 1.5rem;
          margin-right: 0.5rem;
          color: #61dafb;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .card__header {
          border-bottom: 2px solid #61dafb;
          padding: 1rem 1.5rem;
          background-color: #e4f0fb;
          border-radius: 10px 10px 0 0;
        }

        .card__header h3 {
          margin: 0;
          font-weight: 700;
          color: #282c34;
        }

        .card__body {
          padding: 1rem 1.5rem 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #444;
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          border-radius: 26px;
          transition: 0.4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #61dafb;
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }

        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1.5px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          background-color: #fff;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #61dafb;
          box-shadow: 0 0 5px rgba(97, 218, 251, 0.5);
        }

        .checkbox-group label {
          display: inline-block;
          margin-right: 1rem;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          font-size: 0.95rem;
          color: #555;
        }

        .checkbox-group input[type="checkbox"] {
          margin-right: 5px;
          cursor: pointer;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 1px solid #eee;
        }

        .status-item:last-child {
          border-bottom: none;
        }

        .status {
          padding: 0.2rem 0.7rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          min-width: 70px;
          text-align: center;
        }

        .status--success {
          background-color: #4caf50;
        }
      `}</style>

      <div>
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">Settings</h1>
          </div>
          <div className="header-right">
            <div className="current-time">{new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</div>
            <div className="user-profile">
              <i className="fas fa-user-circle"></i>
              <span>Admin</span>
            </div>
          </div>
        </header>
        <div className="settings-grid">
          <div className="card">
            <div className="card__header"><h3>Alert Configuration</h3></div>
            <div className="card__body">
              <div className="form-group">
                <label className="form-label">Email Notifications</label>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">SMS Notifications</label>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Critical Severity Only</label>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card__header"><h3>Scraper Settings</h3></div>
            <div className="card__body">
              <div className="form-group">
                <label className="form-label">Scrape Frequency</label>
                <select className="form-control">
                  <option>Every 1 minutes</option>
                  <option>Every 2 minutes</option>
                  <option>Every 3 minutes</option>
                  <option>Every 4 minutes</option>
                  <option>Every 5 minutes</option>
                  <option>Every 10 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every 1 Hour</option>
                  <option>Every 2 Hour</option>
                  <option>Every 3 Hour</option>
                  <option>Daily</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">OEM Sources</label>
                <div className="checkbox-group">
                  <label><input type="checkbox" defaultChecked /> Cisco</label>
                  <label><input type="checkbox" defaultChecked /> Microsoft</label>
                  <label><input type="checkbox" defaultChecked /> VMware</label>
                  <label><input type="checkbox" /> Juniper</label>
                  <label><input type="checkbox" /> Honeywell</label>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card__header"><h3>System Status</h3></div>
            <div className="card__body">
              <div className="status-item"><span>Database Connection</span><span className="status status--success">Online</span></div>
              <div className="status-item"><span>Scraper Service</span><span className="status status--success">Running</span></div>
              <div className="status-item"><span>API Service</span><span className="status status--success">Healthy</span></div>
              <div className="status-item"><span>Last Scan</span><span>2 minutes ago</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
