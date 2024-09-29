// src/Graph.js
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// get n colors to be able to display n clusters
function generateDistinctColorsRGBA(n) {
  let colors = [];
  for (let i = 0; i < n; i++) {
    let hue = (i * 360 / n) % 360; // Distributes the colors evenly across the hue range
    let rgb = hslToRgb(hue, 100, 50); // Convert HSL to RGB values
    let color = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`; // Set the alpha to 0.6
    colors.push(color);
  }
  return colors;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

function Graph({ points, centroids, clusters }) {
  // Check if clusters are provided, otherwise fallback to the default color
  const hasClusters = clusters && clusters.length > 0;
  const colors = hasClusters ? generateDistinctColorsRGBA(clusters.length) : ['rgba(54, 162, 235, 0.6)'];

  // Prepare datasets for each cluster
  const datasets = hasClusters
    ? clusters.map((cluster, index) => ({
        label: `Cluster ${index + 1}`,
        data: cluster, // Each cluster should have its own points
        backgroundColor: colors[index], // Assign a color to each cluster
      }))
    : [
        {
          label: 'KMeans Clustering Data',
          data: points,
          backgroundColor: colors[0],
        },
      ];

  // Add centroids dataset
  datasets.push({
    label: 'Centroids',
    data: centroids,
    backgroundColor: 'rgba(255, 99, 132, 0.8)',
    pointRadius: 8, // Make centroids bigger
  });

  const data = {
    datasets: datasets,
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
    animation: false,
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Scatter data={data} options={options} />
    </div>
  );
}

export default Graph;