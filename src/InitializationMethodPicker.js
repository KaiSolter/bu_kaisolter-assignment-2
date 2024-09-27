// src/InitializationMethodPicker.js
import React, { useState } from 'react';

function InitializationMethodPicker({ onMethodChange }) {
  const [method, setMethod] = useState('Random'); // Default value

  const handleMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setMethod(selectedMethod);
    onMethodChange(selectedMethod); // Notify parent component
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Initialization Method:
      </label>
      <select
        value={method}
        onChange={handleMethodChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="Random">Random</option>
        <option value="Farthest First">Farthest First</option>
        <option value="KMeans++">KMeans++</option>
        <option value="Manual">Manual</option>
      </select>
    </div>
  );
}

export default InitializationMethodPicker;
