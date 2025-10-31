import React from "react";

export default function Settings() {
  return (
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
                <option>Every 15 minutes</option>
                <option>Every 30 minutes</option>
                <option>Hourly</option>
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
  );
}
