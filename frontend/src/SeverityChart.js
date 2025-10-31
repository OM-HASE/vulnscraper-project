import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function SeverityChart({ statistics }) {
  const data = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [statistics.critical, statistics.high, statistics.medium, statistics.low],
      backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
    }]
  };
  return (
    <div style={{height:300,width:300}}>
      <Doughnut data={data} />
    </div>
  );
}
export default SeverityChart;
