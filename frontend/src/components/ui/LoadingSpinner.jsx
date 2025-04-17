// src/components/ui/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner component for loading states
 * @param {object} props
 * @param {string} props.message - Optional message to display
 */
const LoadingSpinner = ({ message = 'Loading recommendations...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;