import React from "react";

export default function Reports() {
  return (
    <div>
      <header className="header">
        <div className="header-left">
          <h1 className="page-title">Reports</h1>
        </div>
        <div className="header-right">
          <div className="current-time">{new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</div>
          <div className="user-profile">
            <i className="fas fa-user-circle"></i>
            <span>Admin</span>
          </div>
        </div>
      </header>
      <div className="reports-grid">
        <div className="card">
          <div className="card__header"><h3>Generate Reports</h3></div>
          <div className="card__body">
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <select className="form-control">
                <option value="summary">Executive Summary</option>
                <option value="detailed">Detailed Vulnerability Report</option>
                <option value="vendor">Vendor Analysis Report</option>
                <option value="trends">Trend Analysis Report</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date Range</label>
              <div className="date-range">
                <input type="date" className="form-control" defaultValue="2024-09-01" />
                <span>to</span>
                <input type="date" className="form-control" defaultValue="2024-10-10" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Include Severity Levels</label>
              <div className="checkbox-group">
                <label><input type="checkbox" defaultChecked /> Critical</label>
                <label><input type="checkbox" defaultChecked /> High</label>
                <label><input type="checkbox" defaultChecked /> Medium</label>
                <label><input type="checkbox" /> Low</label>
              </div>
            </div>
            <div className="report-actions">
              <button className="btn btn--primary"><i className="fas fa-file-pdf"></i> Generate PDF Report</button>
              <button className="btn btn--secondary"><i className="fas fa-file-csv"></i> Export CSV Data</button>
            </div>
          </div>
        </div>
        {/* Quick Reports section */}
        <div className="card">
          <div className="card__header"><h3>Quick Reports</h3></div>
          <div className="card__body">
            <div className="quick-report-buttons">
              <button className="quick-report-btn"><i className="fas fa-fire"></i>
                <div><div className="report-title">Active Threats</div><div className="report-subtitle">Current vulnerabilities requiring attention</div></div></button>
              <button className="quick-report-btn"><i className="fas fa-exclamation-triangle"></i>
                <div><div className="report-title">Critical Issues</div><div className="report-subtitle">High priority vulnerabilities</div></div></button>
              <button className="quick-report-btn"><i className="fas fa-building"></i>
                <div><div className="report-title">Vendor Summary</div><div className="report-subtitle">Vulnerabilities by vendor</div></div></button>
              <button className="quick-report-btn"><i className="fas fa-calendar-alt"></i>
                <div><div className="report-title">Monthly Report</div><div className="report-subtitle">Last 30 days summary</div></div></button>
            </div>
          </div>
        </div>
        {/* Recent Reports section */}
        <div className="card">
          <div className="card__header"><h3>Recent Reports</h3></div>
          <div className="card__body">
            <div className="report-history">
              <div className="report-history-item">
                <div className="report-info">
                  <div className="report-name">Executive Summary - October 2024</div>
                  <div className="report-details">Generated on Oct 10, 2024 • PDF • 2.3 MB</div>
                </div>
                <div className="report-actions">
                  <button className="action-btn action-btn--view"><i className="fas fa-download"></i></button>
                </div>
              </div>
              <div className="report-history-item">
                <div className="report-info">
                  <div className="report-name">Critical Vulnerabilities Report</div>
                  <div className="report-details">Generated on Oct 8, 2024 • CSV • 156 KB</div>
                </div>
                <div className="report-actions">
                  <button className="action-btn action-btn--view"><i className="fas fa-download"></i></button>
                </div>
              </div>
              <div className="report-history-item">
                <div className="report-info">
                  <div className="report-name">Vendor Analysis - Q3 2024</div>
                  <div className="report-details">Generated on Oct 1, 2024 • PDF • 1.8 MB</div>
                </div>
                <div className="report-actions">
                  <button className="action-btn action-btn--view"><i className="fas fa-download"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Report Statistics */}
        <div className="card">
          <div className="card__header"><h3>Report Statistics</h3></div>
          <div className="card__body">
            <div className="report-stats">
              <div className="stat-item"><div className="stat-number">47</div><div className="stat-label">Reports Generated</div></div>
              <div className="stat-item"><div className="stat-number">12</div><div className="stat-label">This Month</div></div>
              <div className="stat-item"><div className="stat-number">3.2 MB</div><div className="stat-label">Total Size</div></div>
              <div className="stat-item"><div className="stat-number">98%</div><div className="stat-label">Success Rate</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
