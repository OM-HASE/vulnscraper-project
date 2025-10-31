// Dashboard.js
import React from "react";
import Header from "./Header";  // Import your header component
import Metrics from "./Metrics";
import Charts from "./Charts";
import RecentVulns from "./RecentVulns";

export default function Dashboard({ onLogout }) {
  return (
    <div>

      {/* Dashboard main content */}
      <div className="alerts-section" id="alertsSection">
        <div className="alert alert-critical">
          <i className="fas fa-exclamation-triangle"></i>
          <span>New Critical vulnerability detected: Cisco IOS XE Web UI Privilege Escalation</span>
          <button className="alert-close">&times;</button>
        </div>
      </div>

      <div className="dashboard-view active" id="dashboardView">
        <Metrics />
        <Charts />
        <RecentVulns />
      </div>
    </div>
  );
}
