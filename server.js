require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DiscogsService = require('./services/discogsService');
const RecordMatchingService = require('./services/recordMatchingService');
const LLMRecommendationService = require('./services/llmRecommendationService');

// Initialize services using environment variables
const discogsService = new DiscogsService(
  process.env.DISCOGS_CONSUMER_KEY, 
  process.env.DISCOGS_CONSUMER_SECRET
);
const matchingService = new RecordMatchingService();
const llmService = new LLMRecommendationService(process.env.OPENAI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (if needed for caching, etc.)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Define the path to your cached inventory file
const kopsInventoryCachePath = path.join(__dirname, 'kops_inventory.json');

// Root route (new)
app.get('/', (req, res) => {
  res.send("Welcome to the Kopsify. Use /api/recommendations/:username to get recommendations.");
});

// Recommendations route
app.get('/api/recommendations/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`Generating recommendations for user: ${username}`);
    
    // 1. Retrieve the user's vinyl collection from Discogs
    const userCollection = await discogsService.getUserCollection(username);
    console.log(`Retrieved ${userCollection.length} records from Discogs.`);
    
    // 2. Load the Kops inventory from the cached JSON file
    let kopsInventory;
    if (fs.existsSync(kopsInventoryCachePath)) {
      console.log("Loading Kops inventory from cache file:", kopsInventoryCachePath);
      const fileContents = fs.readFileSync(kopsInventoryCachePath, 'utf8');
      kopsInventory = JSON.parse(fileContents);
    } else {
      throw new Error("Kops inventory file not found.");
    }
    console.log(`Loaded ${kopsInventory.length} inventory records from Kops.`);
    
    // 3. Run the matching algorithm to compare the user’s collection with the inventory
    const matches = matchingService.compareCollectionWithInventory(userCollection, kopsInventory); // this line looks to be the problem
    console.log(`Found ${matches.length} matching records.`);
    
    // 4. Generate personalized recommendations using your LLM service
    const recommendations = await llmService.generateRecommendations(userCollection, matches);
    
    res.json(recommendations); // then maybe this one
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});