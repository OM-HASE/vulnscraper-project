import React from "react";

export default function Reports() {
  return (
    <>
      <style>{`
        /* Base and font */
        * {
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #121418; /* Dark background */
          color: #cbd3da;           /* Dark text color */
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        body.light-theme, body.light-theme html {
          background-color: #f5f7fa; /* Light background */
          color: #282c34;            /* Light text color */
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #282c34;       /* Dark header bg */
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        body.light-theme .header {
          background: #ffffff;       /* Light header bg */
          color: #282c34;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
          transition: color 0.4s ease;
        }

        body.light-theme .current-time {
          color: #666666;
        }

        .user-profile {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
          transition: color 0.4s ease;
        }

        body.light-theme .user-profile {
          color: #444444;
        }

        .user-profile i {
          font-size: 1.5rem;
          margin-right: 0.5rem;
          color: #61dafb;
          transition: color 0.4s ease;
        }

        body.light-theme .user-profile i {
          color: #007acc;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: #1e222a; /* Dark card bg */
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.4s ease;
          display: flex;
          flex-direction: column;
        }

        body.light-theme .card {
          background: #ffffff;  /* Light card bg */
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .card__header {
          border-bottom: 2px solid #61dafb;
          padding: 1rem 1.5rem;
          background-color: #22262f; /* Dark header bg */
          border-radius: 10px 10px 0 0;
          transition: background-color 0.4s ease;
        }

        body.light-theme .card__header {
          background-color: #e4f0fb; /* Light header bg */
        }

        .card__header h3 {
          margin: 0;
          font-weight: 700;
          color: #61dafb;
          transition: color 0.4s ease;
        }

        body.light-theme .card__header h3 {
          color: #282c34;
        }

        .card__body {
          padding: 1rem 1.5rem 1.5rem;
          flex-grow: 1;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #a0a0a0;
          transition: color 0.4s ease;
        }

        body.light-theme .form-label {
          color: #444444;
        }

        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1.5px solid #555;
          border-radius: 6px;
          font-size: 1rem;
          background-color: #2a2e39;
          color: #cbd3da;
          transition: border-color 0.3s ease, background-color 0.4s ease, color 0.4s ease;
          cursor: pointer;
        }

        .form-control:focus {
          outline: none;
          border-color: #61dafb;
          box-shadow: 0 0 5px rgba(97, 218, 251, 0.5);
          background-color: #2a2e39;
          color: #f0f0f0;
        }

        body.light-theme .form-control {
          border: 1.5px solid #ddd;
          background-color: #fff;
          color: #282c34;
        }

        .date-range {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .checkbox-group label {
          display: inline-block;
          margin-right: 1rem;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          font-size: 0.95rem;
          color: #999;
          transition: color 0.4s ease;
        }

        body.light-theme .checkbox-group label {
          color: #555;
        }

        .checkbox-group input[type="checkbox"] {
          margin-right: 5px;
          cursor: pointer;
        }

        .report-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
        }

        .btn {
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s ease;
          color: white;
          user-select: none;
        }

        .btn--primary {
          background-color: #61dafb;
        }
        .btn--primary:hover {
          background-color: #21a1f1;
        }

        .btn--secondary {
          background-color: #6c757d;
        }
        .btn--secondary:hover {
          background-color: #535c65;
        }

        .quick-report-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .quick-report-btn {
          display: flex;
          align-items: center;
          background: #282c34;
          border-radius: 8px;
          padding: 12px 16px;
          font-weight: 600;
          color: #61dafb;
          border: 1px solid transparent;
          cursor: pointer;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        body.light-theme .quick-report-btn {
          background: #f0f6fc;
          color: #282c34;
        }

        .quick-report-btn:hover {
          background-color: #3a3f4b;
          border-color: #61dafb;
          color: #ffffff;
        }

        body.light-theme .quick-report-btn:hover {
          background-color: #d0e8ff;
          border-color: #61dafb;
          color: #007acc;
        }

        .quick-report-btn i {
          font-size: 1.5rem;
          margin-right: 1rem;
          color: #61dafb;
          min-width: 32px;
          text-align: center;
          transition: color 0.4s ease;
        }

        body.light-theme .quick-report-btn i {
          color: #007acc;
        }

        .report-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.1rem;
        }
        .report-subtitle {
          font-size: 0.85rem;
          color: #666;
          font-weight: 400;
        }

        .report-history {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .report-history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          border: 1px solid #444;
          border-radius: 8px;
          background-color: #1e222a;
          transition: background-color 0.3s ease, border-color 0.4s ease;
        }

        body.light-theme .report-history-item {
          background-color: #fafafa;
          border: 1px solid #eee;
        }

        .report-history-item:hover {
          background-color: #3a3f4b;
          border-color: #61dafb;
          cursor: pointer;
          color: #fff;
        }

        body.light-theme .report-history-item:hover {
          background-color: #e6f0ff;
          border-color: #61dafb;
          color: #007acc;
        }

        .report-info {
          flex-grow: 1;
          overflow: hidden;
        }

        .report-name {
          font-weight: 700;
          font-size: 1rem;
          color: #61dafb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.4s ease;
        }

        body.light-theme .report-name {
          color: #282c34;
        }

        .report-details {
          font-size: 0.85rem;
          color: #999;
          margin-top: 0.1rem;
          transition: color 0.4s ease;
        }

        body.light-theme .report-details {
          color: #555;
        }

        .action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #61dafb;
          font-size: 1.25rem;
          padding: 0.25rem;
          transition: color 0.3s ease;
        }
        .action-btn:hover {
          color: #21a1f1;
        }

        .report-stats {
          display: flex;
          justify-content: space-around;
          padding-top: 0.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-item {
          background: #282c34;
          border-radius: 10px;
          padding: 1rem 1.5rem;
          flex: 1 1 100px;
          text-align: center;
          box-shadow: 0 3px 8px rgba(0,0,0,0.04);
          transition: background-color 0.4s ease;
        }

        body.light-theme .stat-item {
          background: #f0f6fc;
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #61dafb;
          transition: color 0.4s ease;
        }

        body.light-theme .stat-number {
          color: #282c34;
        }

        .stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #999;
          margin-top: 0.25rem;
          transition: color 0.4s ease;
        }

        body.light-theme .stat-label {
          color: #555;
        }
      `}</style>

      <div>
        <div className="reports-grid">
          <div className="card">
            <div className="card__header">
              <h3>Generate Reports</h3>
            </div>
            <div className="card__body">
              <div className="form-group">
                <label className="form-label">Report Type</label>
                <select className="form-control">
                  <option value="summary">Executive Summary</option>
                  <option value="detailed">Detailed Vulnerability Report</option>
                  {/* <option value="vendor">Vendor Analysis Report</option> */}
                  <option value="trends">Trend Analysis Report</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date Range</label>
                <div className="date-range">
                  <input
                    type="date"
                    className="form-control"
                    defaultValue="2024-09-01"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    className="form-control"
                    defaultValue="2024-10-10"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Include Severity Levels</label>
                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" defaultChecked /> Critical
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> High
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Medium
                  </label>
                  <label>
                    <input type="checkbox" /> Low
                  </label>
                </div>
              </div>
              <div className="report-actions">
                <button className="btn btn--primary">
                  <i className="fas fa-file-pdf"></i> Generate PDF Report
                </button>
                <button className="btn btn--secondary">
                  <i className="fas fa-file-csv"></i> Export CSV Data
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Quick Reports</h3>
            </div>
            <div className="card__body">
              <div className="quick-report-buttons">
                <button className="quick-report-btn">
                  <i className="fas fa-fire"></i>
                  <div>
                    <div className="report-title">Active Threats</div>
                    <div className="report-subtitle">
                      Current vulnerabilities requiring attention
                    </div>
                  </div>
                </button>
                <button className="quick-report-btn">
                  <i className="fas fa-exclamation-triangle"></i>
                  <div>
                    <div className="report-title">Critical Issues</div>
                    <div className="report-subtitle">High priority vulnerabilities</div>
                  </div>
                </button>
                <button className="quick-report-btn">
                  <i className="fas fa-building"></i>
                  {/* <div>
                    <div className="report-title">Vendor Summary</div>
                    <div className="report-subtitle">Vulnerabilities by vendor</div>
                  </div> */}
                </button>
                <button className="quick-report-btn">
                  <i className="fas fa-calendar-alt"></i>
                  <div>
                    <div className="report-title">Monthly Report</div>
                    <div className="report-subtitle">Last 30 days summary</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Recent Reports</h3>
            </div>
            <div className="card__body">
              <div className="report-history">
                <div className="report-history-item">
                  <div className="report-info">
                    <div className="report-name">Executive Summary - October 2024</div>
                    <div className="report-details">
                      Generated on Oct 10, 2024 • PDF • 2.3 MB
                    </div>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn action-btn--view">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
                <div className="report-history-item">
                  <div className="report-info">
                    <div className="report-name">Critical Vulnerabilities Report</div>
                    <div className="report-details">
                      Generated on Oct 8, 2024 • CSV • 156 KB
                    </div>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn action-btn--view">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
                <div className="report-history-item">
                  <div className="report-info">
                    {/* <div className="report-name">Vendor Analysis - Q3 2024</div> */}
                    <div className="report-details">
                      Generated on Oct 1, 2024 • PDF • 1.8 MB
                    </div>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn action-btn--view">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Report Statistics</h3>
            </div>
            <div className="card__body">
              <div className="report-stats">
                <div className="stat-item">
                  <div className="stat-number">47</div>
                  <div className="stat-label">Reports Generated</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-label">This Month</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">3.2 MB</div>
                  <div className="stat-label">Total Size</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}