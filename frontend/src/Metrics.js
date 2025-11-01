import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";

export default function Metrics() {
  const [metrics, setMetrics] = useState({
    totalVulns: 0,
    criticalCount: 0,
    activeThreats: 0,
    resolvedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/vulnerabilities/metrics")
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Error fetching metrics:", err))
      .finally(() => setLoading(false));
  }, []);

  const displayCount = (count) =>
    count === undefined || count === null ? "0" : count.toLocaleString();

  return loading ? (
    <div className="dashboard-metrics-row">
      <div className="loading">Loading metrics...</div>
    </div>
  ) : (
    <div className="dashboard-metrics-row">
      <div className="metric-card">
        <span className="metric-icon">
          <i className="fas fa-shield-alt"></i>
        </span>
        <div className="metric-content">
          <div className="metric-number" id="totalVulns">{displayCount(metrics.totalVulns)}</div>
          <div className="metric-label">Total Vulnerabilities</div>
        </div>
      </div>
      <div className="metric-card critical">
        <span className="metric-icon">
          <i className="fas fa-exclamation-circle"></i>
        </span>
        <div className="metric-content">
          <div className="metric-number" id="criticalCount">{displayCount(metrics.criticalCount)}</div>
          <div className="metric-label">Critical</div>
        </div>
      </div>
      <div className="metric-card active">
        <span className="metric-icon">
          <i className="fas fa-fire"></i>
        </span>
        <div className="metric-content">
          <div className="metric-number" id="activeThreats">{displayCount(metrics.activeThreats)}</div>
          <div className="metric-label">Active Threats</div>
        </div>
      </div>
      <div className="metric-card resolved">
        <span className="metric-icon">
          <i className="fas fa-check-circle"></i>
        </span>
        <div className="metric-content">
          <div className="metric-number" id="resolvedCount">{displayCount(metrics.resolvedCount)}</div>
          <div className="metric-label">Resolved</div>
        </div>
      </div>
    </div>
  );
}
