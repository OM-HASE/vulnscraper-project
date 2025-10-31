import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, Tooltip, Legend);


function TrendsChart({ trends }) {
  const data = {
    labels: trends.map(t => t.date),
    datasets: [{
      label: 'New Vulnerabilities',
      data: trends.map(t => t.count),
      borderColor: '#1FB8CD',
      backgroundColor: 'rgba(31, 184, 205, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
  return (
    <div style={{height:300,width:"100%"}}>
      <Line data={data} />
    </div>
  );
}
export default TrendsChart;
