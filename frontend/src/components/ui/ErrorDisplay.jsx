// src/components/ui/ErrorDisplay.jsx
import React from 'react';
import './ErrorDisplay.css';

/**
 * ErrorDisplay component for displaying error messages
 * @param {object} props
 * @param {Error|string} props.error - Error object or message string
 * @param {function} props.onRetry - Optional retry function
 */
const ErrorDisplay = ({ error, onRetry }) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <div className="error-container">
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      
      <h3 className="error-title">Something went wrong</h3>
      
      <p className="error-message">{errorMessage}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="retry-button btn btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;