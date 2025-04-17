// src/components/ui/RecordCard.jsx
import React, { useState } from 'react';
import './RecordCard.css';

/**
 * RecordCard component for displaying a vinyl record recommendation
 * @param {object} props
 * @param {string} props.id - Record ID
 * @param {string} props.artist - Artist name
 * @param {string} props.title - Album title
 * @param {string} props.imageUrl - Album cover image URL
 * @param {number} props.year - Release year
 * @param {string} props.price - Price
 * @param {string} props.format - Format (LP, EP, etc)
 * @param {string} props.condition - Condition
 * @param {array} props.genres - Genres
 * @param {number} props.matchScore - Match score from 0-1
 * @param {string} props.reasoning - Recommendation reasoning
 * @param {string} props.category - Recommendation category
 * @param {string} props.url - URL to Kops Records page
 */
const RecordCard = ({
  id,
  artist,
  title,
  imageUrl,
  year,
  price,
  format,
  condition,
  genres = [],
  matchScore,
  reasoning,
  category,
  url
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails(!showDetails);
  
  // Generate a placeholder image if no imageUrl is provided
  const imageSrc = imageUrl || `/api/placeholder/300/300`;
  
  // Format match score as percentage
  const matchPercentage = matchScore ? Math.round(matchScore * 100) : null;
  
  return (
    <div className="record-card">
      <div className="record-card-inner">
        <div className="record-image-container">
          {/* Album cover links to Kops website */}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="record-image-link"
          >
            <img src={imageSrc} alt={`${artist} - ${title}`} className="record-image" />
          </a>
          
          {category && (
            <div className="category-tag">{category}</div>
          )}
        </div>
        
        <div className="record-info">
          <h3 className="record-artist">{artist}</h3>
          <h4 className="record-title">{title}</h4>
          
          <div className="record-meta">
            {year && <span className="year">{year}</span>}
            {format && <span className="format">{format}</span>}
            {price && <span className="price">{price}</span>}
          </div>
          
          {genres.length > 0 && (
            <div className="genres">
              {genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}
          
          <button 
            className="details-toggle" 
            onClick={toggleDetails}
            aria-expanded={showDetails}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          {showDetails && (
            <div className="record-details">
              {reasoning && (
                <div className="reasoning">
                  <h5>Why We Recommend This:</h5>
                  <p>{reasoning}</p>
                </div>
              )}
              
              {condition && (
                <div className="condition">
                  <span>Condition:</span> {condition}
                </div>
              )}
              
              <div className="action-buttons">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary view-button"
                >
                  View at Kops Records
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordCard;