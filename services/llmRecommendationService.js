/**
 * @module LLMRecommendationService
 * @description Uses an LLM to generate personalized vinyl record recommendations based on a user's collection and matched inventory.
 */
const { OpenAI } = require('openai');

/**
 * @class LLMRecommendationService
 * @classdesc Wraps OpenAI chat endpoint to craft recommendations and insights from collection and match data.
 */
class LLMRecommendationService {
  /**
   * Creates an LLMRecommendationService.
   * @param {string} apiKey - OpenAI API key for authenticating requests.
   */
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }
  
  /**
   * Generates personalized record recommendations using an LLM.
   * @async
   * @param {Array<Object>} userCollection - The user's existing record collection.
   * @param {Array<Object>} matchedRecords - Inventory records matched by similarity scoring.
   * @param {number} [limit=20] - Maximum number of recommendations to return.
   * @returns {Promise<{recommendations: Array<Object>, collectionInsights: Array<string>}>}
   *   Resolves with recommendation objects enriched by original record data and insights.
   */
  async generateRecommendations(userCollection, matchedRecords, limit = 20) {
    try {
      // Prepare data for LLM prompt
      const collectionSummary = this.createCollectionSummary(userCollection);
      const topMatches = matchedRecords.slice(0, Math.min(50, matchedRecords.length));
      const matchesData = this.formatMatchesData(topMatches);
      
      // Create prompt for the LLM
      const prompt = this.createRecommendationPrompt(collectionSummary, matchesData);
      
      // Call the LLM
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable vinyl record expert and crate digger with deep knowledge of music across all genres and eras. 
            Your task is to recommend vinyl records from an available inventory that would complement and expand a user's existing collection.
            Provide thoughtful, personalized recommendations with specific reasoning for each pick.
            Format your response as a JSON array of recommendation objects.`
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });
      
      
      // Parse and return recommendations
      const rawRecommendations = JSON.parse(response.choices[0].message.content);
      
      // Add the original match data to each recommendation
      const enhancedRecommendations = rawRecommendations.recommendations.map(rec => {
        const originalRecord = matchedRecords.find(r => r.id === rec.id || 
          (r.artist === rec.artist && r.title === rec.title));
        
        return {
          ...rec,
          ...originalRecord,
          reasoning: rec.reasoning,
          category: rec.category
        };
      });
      
      return {
        recommendations: enhancedRecommendations.slice(0, limit),
        collectionInsights: rawRecommendations.collectionInsights || []
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate personalized recommendations');
    }
  }
  
  /**
   * Builds a summary of a user's collection for use in LLM prompts.
   * @param {Array<Object>} userCollection - Records with fields like artist, genres, styles, and year.
   * @returns {Object} Summary including top genres, artists, decades, and a sample of records.
   */
  createCollectionSummary(userCollection) {
    // Count genres
    const genreCounts = {};
    userCollection.forEach(record => {
      const genres = [...(record.genres || []), ...(record.styles || [])];
      genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    // Sort genres by count
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));
    
    // Count artists
    const artistCounts = {};
    userCollection.forEach(record => {
      const artist = record.artist;
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    });
    
    // Sort artists by count
    const topArtists = Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([artist, count]) => ({ artist, count }));
    
    // Count decades
    const decadeCounts = {};
    userCollection.forEach(record => {
      if (record.year) {
        const decade = Math.floor(record.year / 10) * 10 + 's';
        decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
      }
    });
    
    // Sort decades by count
    const topDecades = Object.entries(decadeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([decade, count]) => ({ decade, count }));
    
    // Get collection size
    const collectionSize = userCollection.length;
    
    // Sample of records
    const sampleRecords = userCollection
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 10)
      .map(record => ({
        artist: record.artist,
        title: record.title,
        year: record.year,
        genres: record.genres
      }));
    
    return {
      collectionSize,
      topGenres,
      topArtists,
      topDecades,
      sampleRecords
    };
  }
  
  /**
   * Formats matched inventory records into a JSON-friendly structure.
   * @param {Array<Object>} matches - Array of inventory records with fields like id, artist, title, etc.
   * @returns {Array<Object>} Simplified list of match objects for LLM consumption.
   */
  formatMatchesData(matches) {
    return matches.map(record => ({
      id: record.id || `kops-${Math.random().toString(36).substr(2, 9)}`,
      artist: record.artist,
      title: record.title,
      genres: record.genres || [],
      year: record.year,
      price: record.price,
      format: record.format,
      condition: record.condition,
      matchScore: record.matchScore,
      matchDetails: record.matchDetails
    }));
  }
  
  /**
   * Constructs the chat prompt combining collection summary and inventory data.
   * @param {Object} collectionSummary - User collection overview.
   * @param {Array<Object>} matchesData - Formatted inventory matches.
   * @returns {string} Full prompt string to send to the LLM.
   */
  createRecommendationPrompt(collectionSummary, matchesData) {
    return `
I need vinyl record recommendations based on a user's collection and available inventory.

USER COLLECTION SUMMARY:
- Collection Size: ${collectionSummary.collectionSize} records
- Top Genres: ${JSON.stringify(collectionSummary.topGenres)}
- Top Artists: ${JSON.stringify(collectionSummary.topArtists)}
- Decades: ${JSON.stringify(collectionSummary.topDecades)}
- Sample Records: ${JSON.stringify(collectionSummary.sampleRecords)}

AVAILABLE INVENTORY:
${JSON.stringify(matchesData)}

Please provide:
1. 10-15 personalized recommendations from the available inventory
2. For each recommendation, include:
   - The record details (id, artist, title)
   - A specific, thoughtful reason why this record would complement their collection
   - A category for the recommendation (e.g., "Complete the Collection", "Genre Expansion", "Hidden Gem", "Similar Sound", etc.)
3. 3-5 insights about their collection and recommendations for future collecting

Format your response as a JSON object with the following structure:
{
  "recommendations": [
    {
      "id": "record-id",
      "artist": "Artist Name",
      "title": "Record Title",
      "reasoning": "Personalized explanation for this recommendation...",
      "category": "Category Name"
    }
    // Additional recommendations...
  ],
  "collectionInsights": [
    "Insight 1 about their collection or recommendations for future collecting",
    // Additional insights...
  ]
}
`;
  }
}

module.exports = LLMRecommendationService;