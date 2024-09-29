// src/App.js
import React, { useState, useEffect } from 'react';
import ClusterPicker from './ClusterPicker';
import InitializationMethodPicker from './InitializationMethodPicker';
import Graph from './Graph';

// Function to generate random points in the range of -10 to 10
function generateRandomPoints() {
  const points = [];
  for (let i = 0; i < 200; i++) {
    points.push({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
    });
  }
  return points;
}

// function for calcing the euclidean distance between points
function euclideanDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function assignPointsToCenters(points, centers) {
  const clusters = Array(centers.length).fill(null).map(() => []);
    for (let point of points) {
      let closestCenterIndex = 0;
      let minDistance = euclideanDistance(point, centers[0]);

      for (let i = 1; i < centers.length; i++) {
        const distance = euclideanDistance(point, centers[i]);
        if (distance < minDistance) {
          closestCenterIndex = i;
          minDistance = distance;
        }
      }
      // Assign point to the closest center's cluster
      clusters[closestCenterIndex].push(point);
  };

  return clusters;
}

// Function to generate random centroids in the range of -10 to 10
function generateRandomCentroids(k) {
  const centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
    });
  }
  return centroids;
}

function updateCenters(clusters) {
  return clusters.map(cluster => {
    if (cluster.length === 0) return { x: 0, y: 0 }; // Avoid division by 0
    const sum = cluster.reduce((acc, point) => {
      acc.x += point.x;
      acc.y += point.y;
      return acc;
    }, { x: 0, y: 0 });

    // Calculate the mean position of the points in this cluster
    return {
      x: sum.x / cluster.length,
      y: sum.y / cluster.length
    };
  });
}

function App() {
  const [clusters, setClusters] = useState([]);
  const [points, setPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [k, setK] = useState(3); // Default number of clusters
  const [initMethod, setInitMethod] = useState('Random'); // Default method
  const [step, setStep] = useState(0); // To track steps
  const [converged, setConverged] = useState(false)

  useEffect(() => {
    if (centroids.length > 0) {
      const prevclusters = clusters
      const nclusters = assignPointsToCenters(points, centroids);
      setClusters(nclusters);
      if (JSON.stringify(prevclusters) === JSON.stringify(nclusters)) {
        setConverged(true)
        alert('KMeans has converged')
      }
    }
  }, [centroids]);

  // Function to simulate one step of K-Means
  const stepThroughKMeans = () => {
    if (centroids.length === 0) {
      const initialCentroids = generateRandomCentroids(k);
      setCentroids(initialCentroids);
    } else {
      const newCentroids = updateCenters(clusters)
      setCentroids(newCentroids);
    }
    setStep((prevStep) => prevStep + 1);
  };

  const runToConvergence = () => {
    while(!converged){
      console.log('iteration!!!!')
      stepThroughKMeans 
    }
  }

  const handleClusterChange = (newK) => {
    setK(newK);
    setCentroids([]); // Reset centroids when k changes
    setClusters([]);  // Reset clusters
    setStep(0); // Reset step
    setConverged(false);
  };

  const handleMethodChange = (newMethod) => {
    setInitMethod(newMethod);
  };

  const generateNewDataset = () => {
    setPoints(generateRandomPoints());
    setCentroids([]); // Reset centroids
    setClusters([]);  // Reset clusters
    setStep(0); // Reset step
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">K-Means Clustering Visualization</h1>

      {/* Cluster Picker */}
      <ClusterPicker onClusterChange={handleClusterChange} />

      {/* Initialization Method Picker */}
      <InitializationMethodPicker onMethodChange={handleMethodChange} />

      {/* Generate New Dataset Button */}
      <div className="mb-4">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={generateNewDataset}
        >
          Generate New Dataset
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={stepThroughKMeans}
        >
          Step Through KMeans
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={runToConvergence}
        >
          Run to Convergence
        </button>
      </div>

      {/* Graph */}
      <div className="w-full aspect-square"> 
        <Graph points={points} centroids={centroids} clusters={clusters} />   
      </div>
    </div>
  );
}

export default App;
