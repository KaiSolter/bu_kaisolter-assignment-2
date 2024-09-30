// src/ManualCentroidInput.js
import React, { useState } from "react";

const ManualCentroidInput = ({ k, onCentroidsSubmit }) => {
  const [manualCentroids, setManualCentroids] = useState(
    Array(k).fill({ x: 0, y: 0 })
  );

  const handleCentroidChange = (index, axis, value) => {
    const updatedCentroids = manualCentroids.map((centroid, i) =>
      i === index ? { ...centroid, [axis]: parseFloat(value) } : centroid
    );
    setManualCentroids(updatedCentroids);
  };

  const handleSubmit = () => {
    onCentroidsSubmit(manualCentroids);
  };

  return (
    <div>
      {manualCentroids.map((centroid, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <label>Centroid {index + 1}:</label>
          <input
            type="number"
            value={centroid.x}
            onChange={(e) => handleCentroidChange(index, "x", e.target.value)}
            placeholder="X"
            className="border p-1"
          />
          <input
            type="number"
            value={centroid.y}
            onChange={(e) => handleCentroidChange(index, "y", e.target.value)}
            placeholder="Y"
            className="border p-1"
          />
        </div>
      ))}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit Manual Centroids
      </button>
    </div>
  );
};

export default ManualCentroidInput;
