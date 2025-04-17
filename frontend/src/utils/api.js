// src/utils/api.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Fetches recommendations for a specific Discogs username
 * @param {string} username - The Discogs username
 * @returns {Promise} - Promise resolving to the recommendations data
 */
export const fetchRecommendations = async (username) => {
  if (!username) {
    throw new Error('Username is required');
  }

  try {
    const response = await fetch(`/api/recommendations/${encodeURIComponent(username)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        `Failed to fetch recommendations: ${response.status} ${response.statusText}`
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Helper function to handle API request with loading state and error handling
 * @param {function} apiCall - The API function to call
 * @param {array} dependencies - Dependencies that should trigger a re-fetch
 * @returns {object} - { data, loading, error, refetch }
 */
export const useApiRequest = (apiCall, dependencies = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, [apiCall]);

  useEffect(() => {
    refetch();
  }, [...dependencies, refetch]);

  return { ...state, refetch };
};