/**
 * @module DiscogsService
 * @description A service for interacting with the Discogs API to fetch and process user collection data.
 */

// Discogs API client implementation
const fetch = require('node-fetch');
const DiscogsClient = require('disconnect').Client;

/**
 * @class DiscogsService
 * @classdesc Wraps Discogs API operations for retrieving and formatting a user's record collection.
 */
class DiscogsService {
  /**
   * Creates an instance of DiscogsService.
   * @param {string} consumerKey - The Discogs API consumer key.
   * @param {string} consumerSecret - The Discogs API consumer secret.
   */
  constructor(consumerKey, consumerSecret) {
    this.client = new DiscogsClient({
      consumerKey,
      consumerSecret
    });
    this.db = this.client.database();
    this.user = this.client.user();
  }

  /**
   * Fetches the entire collection of releases for a given Discogs username.
   * Handles pagination automatically to retrieve all pages.
   * @async
   * @param {string} username - The Discogs account username whose collection to retrieve.
   * @returns {Promise<Array>} A promise that resolves to an array of processed release objects.
   * @throws Will throw an error if the Discogs API request fails.
   */
  async getUserCollection(username) {
    try {
      // Pagination handling for large collections
      let page = 1;
      let allItems = [];
      let hasNextPage = true;
      
      while (hasNextPage) {
        const response = await this.user.collection().getReleases(
          username, 0, { page, per_page: 100 }
        );
        
        allItems = [...allItems, ...response.releases];
        
        if (response.pagination.pages > page) {
          page++;
        } else {
          hasNextPage = false;
        }
      }
      
      return this.processCollectionData(allItems);
    } catch (error) {
      console.error('Error fetching Discogs collection:', error);
      throw new Error('Failed to retrieve collection from Discogs');
    }
  }
  

  /**
   * Transforms raw release data from Discogs into a simplified format.
   * @param {Array} releases - The raw release objects returned by the Discogs API.
   * @returns {Array<Object>} An array of formatted release data objects with id, artist, title, year, labels, genres, styles, and formats.
   */
  processCollectionData(releases) {
    // Extract relevant data from releases
    return releases.map(item => ({
      id: item.id,
      artist: item.basic_information.artists.map(a => a.name).join(', '),
      title: item.basic_information.title,
      year: item.basic_information.year,
      labels: item.basic_information.labels.map(l => l.name),
      genres: item.basic_information.genres,
      styles: item.basic_information.styles,
      formats: item.basic_information.formats
    }));
  }
}

module.exports = DiscogsService;