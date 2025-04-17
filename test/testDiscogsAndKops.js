// test.js
require('dotenv').config(); // Load environment variables
const path = require('path');
const fs = require('fs');
const DiscogsService = require('../services/discogsService');
const KopsRecordsService = require('../services/kopsRecordsService');
const RecordMatchingService = require('../services/recordMatchingService');
// Initialize your services
const discogsService = new DiscogsService(
  process.env.DISCOGS_CONSUMER_KEY, 
  process.env.DISCOGS_CONSUMER_SECRET
);


async function testDiscogsService() {
  try {
    console.log('Testing DiscogsService.getUserCollection for user "testuser"...');
    const collection = await discogsService.getUserCollection('charleswang'); // Replace 'testuser' with a valid username if needed
    console.log('Discogs Collection Data:', collection);
  } catch (error) {
    console.error('Error testing DiscogsService:', error);
  }
}



async function testRetrieveKopsInventory() {
  const matchingService = new RecordMatchingService();
  const kopsInventoryCachePath = path.join(__dirname, 'kops_inventory.json');

  const userCollection = await discogsService.getUserCollection("charleswang");
  console.log(`Retrieved ${userCollection.length} records from Discogs.`);

  let kopsInventory;
  if (fs.existsSync(kopsInventoryCachePath)) {
    console.log("Loading Kops inventory from cache file:", kopsInventoryCachePath);
    const fileContents = fs.readFileSync(kopsInventoryCachePath, 'utf8');
    kopsInventory = JSON.parse(fileContents);
  } else {
    throw new Error("Kops inventory file not found.");
  }
  console.log(`Loaded ${kopsInventory.length} inventory records from Kops.`);

  const matches = matchingService.compareCollectionWithInventory(userCollection, kopsInventory);
  console.log(`Found ${matches.length} matching records.`);


  const testCases = [
    ["Kendrick Lamar", "kendrick lamar"],
    ["Lamar, Kendrick", "kendrick lamar"],
    ["Kendrick [ RSD 2025 ]", "kendrick"],
    ["Tyler, the Creator", "tyler the creator"],
    ["Queen (UK)", "queen"],
    ["The Marías", "the marias"]
  ];

  console.log("\n🔍 normalizeArtist() Tests:");
  for (const [input, expected] of testCases) {
    const output = matchingService.normalizeArtistName(input);
    const result = output === expected ? '✅' : '❌';
    console.log(`${result} "${input}" → "${output}" (expected: "${expected}")`);
  }

  // Optionally: log a few of the top matched records for sanity check
  console.log("\n🎧 Sample Matches:");
  matches.slice(0, 5).forEach(match => {
    console.log(`${match.artist} - ${match.title} | Score: ${match.matchScore.toFixed(2)}`);
  });
}


// Run tests sequentially
async function runTests() {
  //await testDiscogsService();
  //await testKopsRecordsService();
  await testRetrieveKopsInventory();
}

runTests();