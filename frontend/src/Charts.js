import React, { useState, useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend
} from "chart.js";
import axios from "axios";
import Chart from "chart.js/auto";
import "./dashboard.css";

// New distinct severity colors
const SEVERITY_COLORS = [
  "#2ecc40", // LOW (green)
  "#ffb347", // MEDIUM (orange)
  "#ff3333", // HIGH (red)
  "#6f42c1", // CRITICAL (purple)
  "#ffe066"  // Unknown (yellow)
];

Chart.register(
  ArcElement, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend
);

export default function Charts() {
  const [severityData, setSeverityData] = useState({
    labels: [],
    datasets: [
      { data: [], backgroundColor: SEVERITY_COLORS }
    ]
  });
  const [trendsData, setTrendsData] = useState({
    labels: [],
    datasets: [
      {
        label: "New Vulnerabilities",
        data: [],
        backgroundColor: "rgba(97, 218, 251, 0.15)",
        borderColor: "#61dafb",
        fill: true, tension: 0.3,
      }
    ]
  });
  const [loading, setLoading] = useState(true);

  // Theme detection
  const [isDarkTheme, setIsDarkTheme] = useState(!document.body.classList.contains("light-theme"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(!document.body.classList.contains("light-theme"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    axios.all([
      axios.get("/api/vulnerabilities/charts/severity"),
      axios.get("/api/vulnerabilities/charts/trends")
    ])
    .then(axios.spread((severityRes, trendsRes) => {
      setSeverityData({
        labels: severityRes.data.labels,
        datasets: [
          { data: severityRes.data.data, backgroundColor: SEVERITY_COLORS }
        ]
      });
      setTrendsData({
        labels: trendsRes.data.labels,
        datasets: [
          {
            label: "New Vulnerabilities",
            data: trendsRes.data.data,
            backgroundColor: "rgba(97, 218, 251, 0.15)",
            borderColor: "#61dafb",
            fill: true, tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: "#61dafb"
          }
        ]
      });
      setLoading(false);
    }))
    .catch(err => {
      setLoading(false);
      console.error("Error fetching chart data", err);
    });
  }, []);

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: isDarkTheme ? "#b2c7d2" : "#282c34" }
      },
      tooltip: {
        backgroundColor: isDarkTheme ? "#23282f" : "#fff",
        titleColor: isDarkTheme ? "#61dafb" : "#000",
        bodyColor: isDarkTheme ? "#cbd3da" : "#000"
      }
    },
    scales: {
      x: { ticks: { color: isDarkTheme ? "#b2c7d2" : "#282c34" }, grid: { color: isDarkTheme ? "#444" : "#eee" } },
      y: { ticks: { color: isDarkTheme ? "#b2c7d2" : "#282c34" }, grid: { color: isDarkTheme ? "#444" : "#eee" } }
    }
  });

  return loading ? (
    <div className="dashboard-charts-row"><div className="loading">Loading charts...</div></div>
  ) : (
    <div className="dashboard-charts-row">
      <div className="chart-card">
        <div className="chart-title">Severity Distribution</div>
        <div className="chart-plot-area doughnut-area">
          <Doughnut data={severityData} options={getChartOptions()} />
        </div>
      </div>
      <div className="chart-card">
        <div className="chart-title">Vulnerability Trends</div>
        <div className="chart-plot-area line-area">
          {trendsData.labels.length === 0 || trendsData.datasets[0].data.length === 0 ? (
            <div style={{ color: "#999", textAlign: "center", padding: "40px 0" }}>
              No vulnerability trends data available.
            </div>
          ) : (
            <Line data={trendsData} options={getChartOptions()} />
          )}
        </div>
      </div>
    </div>
  );
}
