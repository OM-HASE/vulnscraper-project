import React, { useState, useEffect } from "react";
import Metrics from "./Metrics";
import Charts from "./Charts";
import RecentVulns from "./RecentVulns";
import axios from "axios";

export default function Dashboard({ onLogout }) {
  const [criticalVuln, setCriticalVuln] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    axios.get("/api/vulnerabilities/recent")
      .then(res => {
        const vulns = res.data || [];
        const highest = vulns.reduce((top, cur) =>
          (!top || (cur.cvss > top.cvss)) ? cur : top, null);
        setCriticalVuln(highest);
      });
  }, []);

  return (
    <div>
      {showAlert && (
        <div className="alerts-section" id="alertsSection">
          <div className="alert alert-critical">
            <i className="fas fa-exclamation-triangle"></i>
            <span>
              {criticalVuln
                ? (
                  <>
                    New High/Critical vulnerability detected:&nbsp;
                    <b>{criticalVuln.cve}</b> - {criticalVuln.title} | CVSS: <b>{criticalVuln.cvss}</b>
                  </>
                )
                : "No recent high severity vulnerability detected."
              }
            </span>
            <button
              className="alert-close"
              onClick={() => setShowAlert(false)}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-view active" id="dashboardView">
        <Metrics />
        <Charts />
        <RecentVulns />
      </div>
    </div>
  );
}
