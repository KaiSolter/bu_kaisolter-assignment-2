// src/App.js
import React, { useState } from 'react';
import ClusterPicker from './ClusterPicker';

function App() {
  const [clusters, setClusters] = useState([]);
  const [points, setPoints] = useState([]);
  const [k, setK] = useState(3); // Default number of clusters

  const handleRunKMeans = () => {
    console.log(`Running K-means with ${k} clusters`);
    // Logic for running K-means clustering goes here
  };

  const handleClusterChange = (newK) => {
    setK(newK); // Update number of clusters
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">K-Means Clustering Visualization</h1>

      {/* Cluster Picker */}
      <ClusterPicker onClusterChange={handleClusterChange} />

      <div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleRunKMeans}
        >
          Run K-Means
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl">Clusters:</h2>
        <pre>{JSON.stringify(clusters, null, 2)}</pre>
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl">Points:</h2>
        <pre>{JSON.stringify(points, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
