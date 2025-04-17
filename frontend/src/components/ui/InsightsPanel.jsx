// src/components/ui/InsightsPanel.jsx
import React from 'react';
import './InsightsPanel.css';

/**
 * InsightsPanel component to display collection insights
 * @param {object} props
 * @param {array} props.insights - Array of insight strings
 * @param {string} props.username - Discogs username
 */
const InsightsPanel = ({ insights = [], username }) => {
  if (!insights || insights.length === 0) {
    return null;
  }
  
  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h2 className="insights-title">Collection Insights</h2>
        {username && (
          <div className="username-display">
            for <span className="username">{username}</span>
          </div>
        )}
      </div>
      
      <div className="insights-content">
        <ul className="insights-list">
          {insights.map((insight, index) => (
            <li key={index} className="insight-item">
              <div className="insight-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
              </div>
              <div className="insight-text">{insight}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InsightsPanel;