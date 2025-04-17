// testRecordMatching.js
require('dotenv').config(); // Load any env variables if needed

const RecordMatchingService = require('../services/recordMatchingService');

function testRecordMatching() {
  // Instantiate the Record Matching Service.
  const matchingService = new RecordMatchingService();

  // Dummy Discogs collection - array of record objects.
  const discogsCollection = [
    {
      id: '1',
      artist: 'The Beatles',
      title: 'Abbey Road',
      year: 1969,
      genres: ['rock'],
      styles: ['pop rock']
    },
    {
      id: '2',
      artist: 'Miles Davis',
      title: 'Kind of Blue',
      year: 1959,
      genres: ['jazz'],
      styles: ['modal jazz']
    },
    {
      id: '3',
      artist: 'Radiohead',
      title: 'OK Computer',
      year: 1997,
      genres: ['alternative rock'],
      styles: ['art rock']
    }
  ];

  // Dummy Kops Inventory - array of records available from Kops.
  // Adjust these objects to include the fields your matching algorithm expects,
  // such as artist, title, year, and genres.
  const kopsInventory = [
    {
      id: 'a',
      artist: 'The Beatless',
      title: 'Abbey Road',
      year: 1969,
      genres: ['rock']
    },
    {
      id: 'b',
      artist: 'Miles Daviss',
      title: 'Bitches Brew',
      year: 1970,
      genres: ['jazz']
    },
    {
      id: 'c',
      artist: 'Radioheadd',
      title: 'In Rainbows',
      year: 2007,
      genres: ['alternative rock']
    },
    {
      id: 'd',
      artist: 'The Beatless',
      title: 'Let It Be',
      year: 1970,
      genres: ['rock']
    }
  ];

  // Call the matching algorithm. This method should compare the user collection with the inventory
  // and return a sorted list of matches with similarity scores.
  const matches = matchingService.compareCollectionWithInventory(discogsCollection, kopsInventory);

  console.log('Matching Results:', matches);
}

testRecordMatching();