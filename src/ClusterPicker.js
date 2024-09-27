// src/ClusterPicker.js
import React, { useState } from 'react';

function ClusterPicker({ onClusterChange }) {
  const [clusterCount, setClusterCount] = useState(3); // Default value

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setClusterCount(value);
      onClusterChange(value); // Notify parent component
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Number of Clusters (k):
      </label>
      <input
        type="number"
        value={clusterCount}
        onChange={handleInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        min="1"
      />
    </div>
  );
}

export default ClusterPicker;
