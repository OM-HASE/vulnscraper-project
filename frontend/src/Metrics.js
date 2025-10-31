import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Metrics() {
  const [metrics, setMetrics] = useState({
    totalVulns: 0,
    criticalCount: 0,
    activeThreats: 0,
    resolvedCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/vulnerabilities/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="metrics-grid">Loading metrics...</div>;
  }

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div className="metric-content">
          <div className="metric-number" id="totalVulns">{metrics.totalVulns}</div>
          <div className="metric-label">Total Vulnerabilities</div>
        </div>
      </div>
      <div className="metric-card critical">
        <div className="metric-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <div className="metric-content">
          <div className="metric-number" id="criticalCount">{metrics.criticalCount}</div>
          <div className="metric-label">Critical/High</div>
        </div>
      </div>
      <div className="metric-card active">
        <div className="metric-icon">
          <i className="fas fa-fire"></i>
        </div>
        <div className="metric-content">
          <div className="metric-number" id="activeThreats">{metrics.activeThreats}</div>
          <div className="metric-label">Active Threats</div>
        </div>
      </div>
      <div className="metric-card resolved">
        <div className="metric-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="metric-content">
          <div className="metric-number" id="resolvedCount">{metrics.resolvedCount}</div>
          <div className="metric-label">Resolved</div>
        </div>
      </div>
    </div>
  );
}
