/**
 * @module RecordMatchingService
 * @description Service to compare a user's Discogs collection against Kops inventory using genre, artist, and era similarities.
 */
const stringSimilarity = require('string-similarity');

/**
 * @class RecordMatchingService
 * @classdesc Provides methods to compute similarity scores between a user's collection and inventory records.
 */
class RecordMatchingService {
  /**
   * Creates an instance of RecordMatchingService.
   * @constructor
   * @param {number} [similarityThreshold=0.65] - Minimum overall match score to consider a record a match.
   */
  constructor() {
    this.similarityThreshold = 0.6; // Minimum score to consider a match
  }
  
  /**
   * Compares the user's Discogs collection with Kops inventory records.
   * @param {Array<Object>} userCollection - The user's collection records.
   * @param {Array<Object>} kopsInventory - The Kops inventory records to compare against.
   * @returns {Array<Object>} Sorted array of matching records with match scores and details.
   */
  compareCollectionWithInventory(userCollection, kopsInventory) {
    // Extract characteristics from the user collection
    const userGenres = this.extractGenres(userCollection);
    //console.log(userGenres);
    const userArtists = this.extractArtists(userCollection);
    console.log(userArtists);
    const userEras = this.extractEras(userCollection);
    
    const potentialMatches = kopsInventory.map(record => {
      const genreSimilarity = this.calculateGenreSimilarity(userGenres, record.genres);
      const artistSimilarity = this.calculateArtistSimilarity(userArtists, record.artist);
      const eraSimilarity = this.calculateEraSimilarity(userEras, record.year);
      
      // Weighted average: adjust the weights as needed
      const overallScore = (genreSimilarity * 0.5) + (artistSimilarity * 0.5) + (eraSimilarity * 0.2);
      
      return {
        ...record,
        matchScore: overallScore,
        matchDetails: { genreSimilarity, artistSimilarity, eraSimilarity }
      };
    });
    
    const matches = potentialMatches.filter(record => record.matchScore >= this.similarityThreshold);
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
  
  /**
   * Normalizes an artist name by lowercasing, removing punctuation, diacritics, and extra whitespace.
   * @param {string} name - The artist name to normalize.
   * @returns {string} The cleaned, normalized artist name.
   */
  normalizeArtistName(name = "") {
    if (!name) return "";
  
    let cleaned = name.toLowerCase();
  
    // 1. remove anything in [...] or (...)
    cleaned = cleaned.replace(/\[[^\]]*]|\([^)]+\)/g, " ");
  
    // 2. handle comma logic  ("last, first" swap if second part one word)
    if (cleaned.includes(",")) {
      const [part1, part2] = cleaned.split(",").map(s => s.trim());
      if (part1 && part2) {
        cleaned =
          part2.split(/\s+/).length === 1
            ? `${part2} ${part1}`
            : `${part1} ${part2}`;
      }
    }
  
    // 3. strip punctuation but keep letters/digits/space/marks
    cleaned = cleaned.replace(/[^\p{L}\p{M}0-9\s]/gu, " ");
  
    // 4. **remove diacritics**  →  de‑compose then drop mark category
    cleaned = cleaned.normalize("NFD").replace(/\p{M}/gu, "");
  
    // 5. drop tokens containing digits (years, catalogue numbers)
    cleaned = cleaned.replace(/\b\w*\d\w*\b/gu, " ");
  
    // 6. collapse spaces & trim
    cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
  
    return cleaned;
  }
  
  /**
   * Extracts and counts genres from a collection.
   * @param {Array<Object>} collection - Array of records with genres and styles.
   * @returns {Object.<string, number>} Map of genre names to their occurrence count.
   */
  extractGenres(collection) {
    const genreCounts = {};
    collection.forEach(record => {
      const genres = [...(record.genres || []), ...(record.styles || [])];
      genres.forEach(genre => {
        const lowerGenre = genre.toLowerCase();
        genreCounts[lowerGenre] = (genreCounts[lowerGenre] || 0) + 1;
      });
    });
    return genreCounts;
  }
  
  /**
   * Extracts and counts normalized artist names from a collection.
   * @param {Array<Object>} collection - Array of records with an artist field.
   * @returns {Object.<string, number>} Map of normalized artist names to their occurrence count.
   */
  extractArtists(collection) {
    const artistCounts = {};
    collection.forEach(record => {
      const artists = record.artist.split(', ');
      artists.forEach(artist => {
        const normalized = this.normalizeArtistName(artist);
        artistCounts[normalized] = (artistCounts[normalized] || 0) + 1;
      });
    });
    return artistCounts;
  }
  
  /**
   * Extracts and counts decades (eras) from a collection.
   * @param {Array<Object>} collection - Array of records with a year property.
   * @returns {Object.<number, number>} Map of decade to count of records from that era.
   */
  extractEras(collection) {
    const eraCounts = {};
    collection.forEach(record => {
      if (record.year) {
        const decade = Math.floor(record.year / 10) * 10;
        eraCounts[decade] = (eraCounts[decade] || 0) + 1;
      }
    });
    return eraCounts;
  }
  
  /**
   * Calculates the fraction of record genres present in the user's genres.
   * @param {Object.<string, number>} userGenres - Map of user's genre counts.
   * @param {Array<string>} recordGenres - List of genres for a single record.
   * @returns {number} Similarity ratio between 0 and 1.
   */
  calculateGenreSimilarity(userGenres, recordGenres) {
    if (!recordGenres || recordGenres.length === 0) return 0;
    const userGenreSet = new Set(Object.keys(userGenres));
    let matchCount = 0;
    recordGenres.forEach(genre => {
      if (userGenreSet.has(genre.toLowerCase())) {
        matchCount++;
      }
    });
    return recordGenres.length > 0 ? matchCount / recordGenres.length : 0;
  }
  
  /**
   * Calculates artist similarity using fuzzy matching between user collection and a record's artist.
   * @param {Object.<string, number>} userArtists - Map of normalized artist names to counts.
   * @param {string} recordArtist - The artist string from a record.
   * @returns {number} Similarity score between 0 and 1.
   */
  calculateArtistSimilarity(userArtists, recordArtist) {
    if (!recordArtist) return 0;
    
    // Normalize the record's artist string and split it into possible artist names.
    const normalizedRecord = this.normalizeArtistName(recordArtist);
    // Assume multiple artists may be comma-separated; also, sometimes extra parts may exist.
    const recordArtists = normalizedRecord.split(/[,;]+/).map(name => name.trim());
    
    let totalScore = 0;
    
    // For each normalized artist in the record, compute similarity with every user artist,
    // then use the highest similarity.
    recordArtists.forEach(artist => {
      const scores = Object.keys(userArtists).map(userArtist => {
        return stringSimilarity.compareTwoStrings(artist, userArtist);
      });
      const bestScore = scores.length ? Math.max(...scores) : 0;
      totalScore += bestScore;
    });
    
    return recordArtists.length > 0 ? Math.min(totalScore / recordArtists.length, 1) : 0;
  }
  
  /**
   * Calculates era (decade) similarity between user's eras and a record's release year.
   * @param {Object.<number, number>} userEras - Map of decade to record count.
   * @param {number} recordYear - The release year of the record.
   * @returns {number} Similarity score, with defaults for missing decades.
   */
  calculateEraSimilarity(userEras, recordYear) {
    if (!recordYear) return 0.5; // Neutral if unknown
    const recordDecade = Math.floor(recordYear / 10) * 10;
    const totalRecords = Object.values(userEras).reduce((total, count) => total + count, 0);
    
    if (userEras[recordDecade]) {
      return Math.min(userEras[recordDecade] / (totalRecords * 0.25), 1);
    }
    
    const prevDecade = recordDecade - 10;
    const nextDecade = recordDecade + 10;
    if (userEras[prevDecade] || userEras[nextDecade]) {
      return 0.7;
    }
    
    return 0.3;
  }
}

module.exports = RecordMatchingService;