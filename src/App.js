// src/App.js
import React, { useState, useEffect } from "react";
import ClusterPicker from "./ClusterPicker";
import InitializationMethodPicker from "./InitializationMethodPicker";
import Graph from "./Graph";

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
  const clusters = Array(centers.length)
    .fill(null)
    .map(() => []);
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
  }

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

function generateFarthestFirstCentroids(k, points) {
  const centroids = [];

  // Step 1: Randomly pick the first centroid from the points
  centroids.push(points[Math.floor(Math.random() * points.length)]);

  // Step 2: Pick the remaining k-1 centroids
  for (let i = 1; i < k; i++) {
    let farthestPoint = null;
    let maxDistance = -Infinity;

    // For each point, find the distance to the nearest centroid
    for (let point of points) {
      let minDistanceToCentroids = Infinity;

      for (let centroid of centroids) {
        const distance = euclideanDistance(point, centroid);
        if (distance < minDistanceToCentroids) {
          minDistanceToCentroids = distance;
        }
      }

      // Track the point that is farthest from the current set of centroids
      if (minDistanceToCentroids > maxDistance) {
        maxDistance = minDistanceToCentroids;
        farthestPoint = point;
      }
    }

    // Add the farthest point to the centroids
    centroids.push(farthestPoint);
  }

  return centroids;
}

// Function to select a random point based on a given set of probabilities
function selectRandomPointWithProbability(points, probabilities) {
  const r = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < points.length; i++) {
    cumulativeProbability += probabilities[i];
    if (r <= cumulativeProbability) {
      return points[i];
    }
  }

  // Just in case rounding errors cause no point to be selected, return the last one
  return points[points.length - 1];
}

function generateKMeansPlusPlusCentroids(k, points) {
  const centroids = [];

  // Step 1: Randomly pick the first centroid from the points
  centroids.push(points[Math.floor(Math.random() * points.length)]);

  // Step 2: Pick the remaining k-1 centroids
  for (let i = 1; i < k; i++) {
    const distances = points.map((point) => {
      // Find the minimum distance from this point to any already chosen centroid
      const minDistanceToCentroids = centroids.reduce(
        (minDistance, centroid) => {
          const distance = euclideanDistance(point, centroid);
          return Math.min(minDistance, distance);
        },
        Infinity
      );

      // Square the distance as per KMeans++ algorithm
      return minDistanceToCentroids ** 2;
    });

    // Step 3: Select the next centroid based on weighted probability
    const totalDistance = distances.reduce((sum, d) => sum + d, 0);
    const probabilities = distances.map((distance) => distance / totalDistance);

    // Step 4: Select the next centroid using the probabilities
    const nextCentroid = selectRandomPointWithProbability(
      points,
      probabilities
    );
    centroids.push(nextCentroid);
  }

  return centroids;
}

function updateCenters(clusters) {
  return clusters.map((cluster) => {
    if (cluster.length === 0) return { x: 0, y: 0 }; // Avoid division by 0
    const sum = cluster.reduce(
      (acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
      },
      { x: 0, y: 0 }
    );

    // Calculate the mean position of the points in this cluster
    return {
      x: sum.x / cluster.length,
      y: sum.y / cluster.length,
    };
  });
}

function centroidsHaveConverged(prevCentroids, newCentroids) {
  const threshold = 0.0001; // Small threshold to account for floating-point precision
  for (let i = 0; i < prevCentroids.length; i++) {
    const distance = euclideanDistance(prevCentroids[i], newCentroids[i]);
    if (distance > threshold) {
      return false; // Centroids haven't converged
    }
  }
  return true; // All centroids are close enough to be considered converged
}

function App() {
  const [clusters, setClusters] = useState([]);
  const [points, setPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [k, setK] = useState(3); // Default number of clusters
  const [initMethod, setInitMethod] = useState("Random"); // Default method
  const [step, setStep] = useState(0); // To track steps
  const [converged, setConverged] = useState(false);
  const [isRunning, setIsRunning] = useState(false); // Track if running to convergence

  useEffect(() => {
    if (centroids.length > 0) {
      const newClusters = assignPointsToCenters(points, centroids);
      setClusters(newClusters);

      const hasConverged = centroidsHaveConverged(
        centroids,
        updateCenters(newClusters)
      );
      if (hasConverged) {
        setConverged(true);
        stopConvergence();
        alert("KMeans has converged");
      }
    }
  }, [centroids]);

  useEffect(() => {
    if (isRunning && !converged) {
      const timer = setTimeout(stepThroughKMeans, 300); // Delay between iterations
      return () => clearTimeout(timer); // Cleanup timeout
    } else {
      stopConvergence();
    }
  }, [isRunning, converged, step]);

  const initializeCentroids = () => {
    switch (initMethod) {
      case "Random":
        return generateRandomCentroids(k);
      case "Farthest First":
        return generateFarthestFirstCentroids(k, points);
      case "KMeans++":
        return generateKMeansPlusPlusCentroids(k, points);
      case "Manual":
        break;
    }
  };

  // Function to simulate one step of K-Means
  const stepThroughKMeans = () => {
    if (centroids.length === 0) {
      const initialCentroids = initializeCentroids();
      setCentroids(initialCentroids);
    } else {
      const newCentroids = updateCenters(clusters);
      setCentroids(newCentroids);
    }
    setStep((prevStep) => prevStep + 1);
  };

  const runToConvergence = () => {
    setIsRunning(true); // Start the automatic process
  };

  const stopConvergence = () => {
    setIsRunning(false); // Stop the automatic process
  };

  const handleClusterChange = (newK) => {
    setK(newK);
    setCentroids([]); // Reset centroids when k changes
    setClusters([]); // Reset clusters
    setStep(0); // Reset step
    setConverged(false);
    setIsRunning(false);
  };

  const handleMethodChange = (newMethod) => {
    setInitMethod(newMethod);
  };

  const generateNewDataset = () => {
    setPoints(generateRandomPoints());
    setCentroids([]); // Reset centroids
    setClusters([]); // Reset clusters
    setStep(0); // Reset step
    setConverged(false);
    setIsRunning(false);
  };

  const resetAlg = () => {
    setCentroids([]); // Reset centroids
    setClusters([]); // Reset clusters
    setStep(0); // Reset step
    setConverged(false);
    setIsRunning(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        K-Means Clustering Visualization
      </h1>

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
      {points.length > 0 && (
        <>
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
          <div className="flex gap-4 mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={resetAlg}
            >
              Reset Algorithm
            </button>
          </div>
        </>
      )}

      {/* Graph */}
      <div
        className="w-full max-w-lg mx-auto p-4 bg-white shadow-lg border-2 border-gray-300 rounded-md"
        style={{ height: "500px", width: "500px" }}
      >
        <Graph points={points} centroids={centroids} clusters={clusters} />
      </div>
    </div>
  );
}

export default App;
