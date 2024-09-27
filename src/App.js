// src/App.js
import React, { useState } from 'react';
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


function App() {
  const [clusters, setClusters] = useState([]);
  const [points, setPoints] = useState(generateRandomPoints());
  const [k, setK] = useState(3); // Default number of clusters
  const [initMethod, setInitMethod] = useState('Random'); // Default method
  const [step, setStep] = useState(0); // To track steps if needed

  // Function to simulate K-Means to convergence
  const runToConvergence = () => {
    console.log(`Running K-means with ${k} clusters using ${initMethod} initialization to convergence`);
    // Add logic to run the entire K-means clustering algorithm until convergence
  };

  // Function to simulate one step of K-Means
  const stepThroughKMeans = () => {
    console.log(`Running one step of K-means with ${k} clusters using ${initMethod} initialization`);
    // Add logic to run one step of the K-means clustering algorithm
    setStep((prevStep) => prevStep + 1);
  };

  const handleClusterChange = (newK) => {
    setK(newK);
  };

  const handleMethodChange = (newMethod) => {
    setInitMethod(newMethod);
  };

  const generateNewDataset = () => {
    setPoints(generateRandomPoints());
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

      {/* Graph */}
      <Graph points={points} />

      {/* KMeans Buttons */}
      <div className="flex gap-4 mt-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={runToConvergence}
        >
          Run To Convergence
        </button>
        <button 
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={stepThroughKMeans}
        >
          Step Through KMeans
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl">Clusters:</h2>
        <pre>{JSON.stringify(clusters, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
