// src/components/ui/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import './FilterBar.css';

/**
 * FilterBar component for filtering recommendations
 * @param {object} props
 * @param {object} props.filters - Current active filters
 * @param {function} props.updateFilter - Function to update a filter
 * @param {function} props.resetFilters - Function to reset all filters
 * @param {array} props.categories - Available categories
 */
const FilterBar = ({ 
  filters, 
  updateFilter, 
  resetFilters,
  categories = []
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  
  // Update search term in filters when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.searchTerm) {
        updateFilter('searchTerm', searchTerm);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, filters.searchTerm, updateFilter]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle category selection
  const handleCategoryChange = (e) => {
    updateFilter('category', e.target.value);
  };
  
  return (
    <div className="filter-bar">
      <div className="filter-section search-section">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search by artist or album..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {categories.length > 0 && (
        <div className="filter-section category-section">
          <label htmlFor="category-filter" className="filter-label">Category:</label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Additional filters could be added here */}
      
      <div className="filter-section reset-section">
        <button 
          className="reset-filters-btn" 
          onClick={resetFilters}
          disabled={
            !filters.searchTerm && 
            (!filters.category || filters.category === 'all')
          }
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;