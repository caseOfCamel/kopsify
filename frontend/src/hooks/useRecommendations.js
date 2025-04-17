// src/hooks/useRecommendations.js
import { useState, useEffect, useCallback } from 'react';
import { fetchRecommendations } from '../utils/api';

/**
 * Custom hook to fetch and manage recommendations
 * @param {string} username - The Discogs username
 * @param {object} options - Additional options
 * @returns {object} - Recommendations data with loading and error states
 */
const useRecommendations = (username, options = {}) => {
  const [data, setData] = useState(null);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    searchTerm: '',
    // Add more filters as needed (year, genre, etc.)
  });

  // Fetch recommendations
  const fetchData = useCallback(async () => {
    if (!username) {
      setError(new Error('Username is required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recommendationsData = await fetchRecommendations(username);
      setData(recommendationsData);
      // Initial filtered data is the same as all data
      setFilteredRecommendations(recommendationsData.recommendations || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters whenever filters or data changes
  useEffect(() => {
    if (!data?.recommendations) return;

    let result = [...data.recommendations];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      result = result.filter(item => 
        item.category && item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.artist && item.artist.toLowerCase().includes(term)) ||
        (item.title && item.title.toLowerCase().includes(term))
      );
    }

    // Apply more filters here as needed

    setFilteredRecommendations(result);
  }, [filters, data]);

  // Update a specific filter
  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: 'all',
      searchTerm: '',
      // Reset other filters here
    });
  }, []);

  return {
    // Original data
    data,
    recommendations: data?.recommendations || [],
    collectionInsights: data?.collectionInsights || [],
    
    // Filtered data
    filteredRecommendations,
    
    // State
    loading,
    error,
    
    // Filter management
    filters,
    updateFilter,
    resetFilters,
    
    // Actions
    refetch: fetchData
  };
};

export default useRecommendations;