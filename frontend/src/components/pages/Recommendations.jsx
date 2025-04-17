// src/components/pages/Recommendations.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Recommendations.css';

import RecordCard from '../ui/RecordCard';
import FilterBar from '../ui/FilterBar';
import InsightsPanel from '../ui/InsightsPanel';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';
import useRecommendations from '../../hooks/useRecommendations';

const Recommendations = () => {
  const { username } = useParams();
  const {
    filteredRecommendations,
    collectionInsights,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    refetch
  } = useRecommendations(username);
  
  // Extract unique categories from recommendations for filter dropdown
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    if (filteredRecommendations.length > 0) {
      const uniqueCategories = [...new Set(
        filteredRecommendations
          .filter(rec => rec.category)
          .map(rec => rec.category)
      )];
      setCategories(uniqueCategories);
    }
  }, [filteredRecommendations]);
  
  // Handle no results after filtering
  const hasFilteredResults = filteredRecommendations.length > 0;
  const isFiltering = filters.category !== 'all' || filters.searchTerm;
  
  return (
    <div className="recommendations-page">
      <div className="container">
        <div className="recommendations-header">
          <h1 className="page-title">
            Vinyl Recommendations
            {username && <span className="username-display"> for {username}</span>}
          </h1>
          
          <p className="page-description">
            Personalized picks from Kops Records based on your Discogs collection.
          </p>
        </div>
        
        {/* Loading State */}
        {loading && <LoadingSpinner />}
        
        {/* Error State */}
        {error && !loading && (
          <ErrorDisplay 
            error={error}
            onRetry={refetch}
          />
        )}
        
        {/* Results Content */}
        {!loading && !error && (
          <>
            {/* Collection Insights */}
            <InsightsPanel 
              insights={collectionInsights}
              username={username}
            />
            
            {/* Filters */}
            <FilterBar 
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              categories={categories}
            />
            
            {/* No Results Message */}
            {!hasFilteredResults && isFiltering && (
              <div className="no-results">
                <p>No records match your current filters.</p>
                <button 
                  onClick={resetFilters}
                  className="reset-filters-btn"
                >
                  Reset Filters
                </button>
              </div>
            )}
            
            {/* Results Grid */}
            {hasFilteredResults && (
              <div className="records-grid">
                {filteredRecommendations.map(record => (
                  <RecordCard 
                    key={record.id}
                    id={record.id}
                    artist={record.artist}
                    title={record.title}
                    imageUrl={record.imageUrl}
                    year={record.year}
                    price={record.price}
                    format={record.format}
                    condition={record.condition}
                    genres={record.genres}
                    matchScore={record.matchScore}
                    reasoning={record.reasoning}
                    category={record.category}
                    url={record.url}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;