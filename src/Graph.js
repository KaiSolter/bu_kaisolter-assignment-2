// src/Graph.js
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function Graph({ points }) {
  const data = {
    datasets: [
      {
        label: 'KMeans Clustering Data',
        data: points,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min: -10,
        max: 10,
      },
      y: {
        min: -10,
        max: 10,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Scatter data={data} options={options} />
    </div>
  );
}

export default Graph;
