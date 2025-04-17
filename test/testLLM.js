require('dotenv').config();
const LLMRecommendationService = require('../services/llmRecommendationService');

async function testLLM() {
  const llmService = new LLMRecommendationService(process.env.OPENAI_API_KEY);

  // ---- Bigger Dummy Collection ----
  const dummyCollection = [
    { artist: 'The Beatles', title: 'Abbey Road', genres: ['Rock'], year: 1969 },
    { artist: 'Pink Floyd', title: 'The Dark Side of the Moon', genres: ['Progressive Rock'], year: 1973 },
    { artist: 'Miles Davis', title: 'Kind of Blue', genres: ['Jazz'], year: 1959 },
    { artist: 'Radiohead', title: 'OK Computer', genres: ['Alternative Rock', 'Art Rock'], year: 1997 },
    { artist: 'Daft Punk', title: 'Random Access Memories', genres: ['Electronic', 'Disco'], year: 2013 },
    { artist: 'Kendrick Lamar', title: 'DAMN.', genres: ['Hip Hop'], year: 2017 },
    { artist: 'Björk', title: 'Homogenic', genres: ['Electronic', 'Experimental'], year: 1997 },
    { artist: 'Nirvana', title: 'Nevermind', genres: ['Grunge', 'Alternative Rock'], year: 1991 },
    { artist: 'Carole King', title: 'Tapestry', genres: ['Singer/Songwriter', 'Pop'], year: 1971 },
    { artist: 'The Clash', title: 'London Calling', genres: ['Punk'], year: 1979 },
  ];

  // ---- Bigger Dummy Matches ----
  const dummyMatches = [
    {
      id: 'm1',
      artist: 'The Beatles',
      title: 'Revolver',
      genres: ['Rock'], year: 1966,
      price: 22.99,
      format: 'LP',
      condition: 'Very Good Plus',
      matchScore: 0.92,
      matchDetails: { genreSimilarity: 1, artistSimilarity: 1, eraSimilarity: 0.9 }
    },
    {
      id: 'm2',
      artist: 'Pink Floyd',
      title: 'Wish You Were Here',
      genres: ['Progressive Rock'], year: 1975,
      price: 24.50,
      format: 'LP',
      condition: 'Near Mint',
      matchScore: 0.88,
      matchDetails: { genreSimilarity: 0.95, artistSimilarity: 1, eraSimilarity: 0.8 }
    },
    {
      id: 'm3',
      artist: 'Miles Davis',
      title: 'Sketches of Spain',
      genres: ['Jazz'], year: 1960,
      price: 27.00,
      format: 'LP',
      condition: 'Very Good',
      matchScore: 0.85,
      matchDetails: { genreSimilarity: 1, artistSimilarity: 1, eraSimilarity: 0.7 }
    },
    {
      id: 'm4',
      artist: 'Radiohead',
      title: 'Kid A',
      genres: ['Alternative Rock', 'Electronic'], year: 2000,
      price: 21.75,
      format: 'LP',
      condition: 'Mint',
      matchScore: 0.80,
      matchDetails: { genreSimilarity: 0.8, artistSimilarity: 1, eraSimilarity: 0.6 }
    },
    {
      id: 'm5',
      artist: 'Daft Punk',
      title: 'Discovery',
      genres: ['Electronic', 'House'], year: 2001,
      price: 23.25,
      format: 'LP',
      condition: 'Near Mint',
      matchScore: 0.78,
      matchDetails: { genreSimilarity: 0.9, artistSimilarity: 1, eraSimilarity: 0.5 }
    },
    {
      id: 'm6',
      artist: 'Björk',
      title: 'Debut',
      genres: ['Electronic', 'Pop'], year: 1993,
      price: 26.00,
      format: 'LP',
      condition: 'Very Good Plus',
      matchScore: 0.76,
      matchDetails: { genreSimilarity: 0.85, artistSimilarity: 1, eraSimilarity: 0.7 }
    },
    {
      id: 'm7',
      artist: 'Nirvana',
      title: 'In Utero',
      genres: ['Grunge'], year: 1993,
      price: 20.00,
      format: 'LP',
      condition: 'Very Good',
      matchScore: 0.74,
      matchDetails: { genreSimilarity: 1, artistSimilarity: 1, eraSimilarity: 0.6 }
    },
    {
      id: 'm8',
      artist: 'Carole King',
      title: 'Music',
      genres: ['Singer/Songwriter'], year: 1971,
      price: 19.99,
      format: 'LP',
      condition: 'Near Mint',
      matchScore: 0.70,
      matchDetails: { genreSimilarity: 0.9, artistSimilarity: 1, eraSimilarity: 0.8 }
    },
    {
      id: 'm9',
      artist: 'The Clash',
      title: 'Combat Rock',
      genres: ['Punk'], year: 1982,
      price: 18.50,
      format: 'LP',
      condition: 'Very Good',
      matchScore: 0.68,
      matchDetails: { genreSimilarity: 1, artistSimilarity: 1, eraSimilarity: 0.5 }
    },
    {
      id: 'm10',
      artist: 'David Bowie',
      title: 'The Rise and Fall of Ziggy Stardust',
      genres: ['Glam Rock'], year: 1972,
      price: 25.00,
      format: 'LP',
      condition: 'Mint',
      matchScore: 0.65,
      matchDetails: { genreSimilarity: 0.8, artistSimilarity: 0, eraSimilarity: 0.8 }
    },
  ];

  try {
    const recommendations = await llmService.generateRecommendations(dummyCollection, dummyMatches);
    console.log('LLM Recommendations:', recommendations);
  } catch (error) {
    console.error('Error testing LLMRecommendationService:', error);
  }
}

testLLM();