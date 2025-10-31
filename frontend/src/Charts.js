import React, { useState, useEffect } from "react";
import { Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Chart from 'chart.js/auto';
import axios from 'axios';

Chart.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Charts() {
  const [severityData, setSeverityData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ["#ff3333", "#ffb347", "#ffe066", "#6fd3c3"]
    }]
  });

  const [trendsData, setTrendsData] = useState({
    labels: [],
    datasets: [{
      label: "New Vulnerabilities",
      data: [],
      backgroundColor: "rgba(0,188,212,0.15)",
      borderColor: "#00bcd4",
      fill: true,
      tension: 0.2
    }]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const [severityResponse, trendsResponse] = await Promise.all([
        axios.get('/api/vulnerabilities/charts/severity'),
        axios.get('/api/vulnerabilities/charts/trends')
      ]);

      // Update severity chart
      setSeverityData({
        labels: severityResponse.data.labels,
        datasets: [{
          data: severityResponse.data.data,
          backgroundColor: ["#ff3333", "#ffb347", "#ffe066", "#6fd3c3"]
        }]
      });

      // Update trends chart
      setTrendsData({
        labels: trendsResponse.data.labels,
        datasets: [{
          label: "New Vulnerabilities",
          data: trendsResponse.data.data,
          backgroundColor: "rgba(0,188,212,0.15)",
          borderColor: "#00bcd4",
          fill: true,
          tension: 0.2
        }]
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="charts-section">Loading charts...</div>;
  }

  return (
    <div className="charts-section">
      <div className="chart-container">
        <div className="card">
          <div className="card__header"><h3>Severity Distribution</h3></div>
          <div className="card__body">
            <Doughnut data={severityData} />
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div className="card">
          <div className="card__header"><h3>Vulnerability Trends</h3></div>
          <div className="card__body">
            <Line data={trendsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
