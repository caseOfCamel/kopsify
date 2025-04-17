// exportKopsInventory.js

require('dotenv').config(); // Load environment variables

const fs = require('fs');
const path = require('path');
const KopsRecordsService = require('../services/kopsRecordsService');

(async function exportInventory() {
  try {
    // Create an instance of your KopsRecordsService
    const kopsService = new KopsRecordsService();
    
    console.log("Fetching current Kops Records inventory...");
    // Pass forceRefresh as true to ensure a fresh scrape
    const inventory = await kopsService.getInventory(true);
    
    // Define output file path
    const outputFile = path.join(__dirname, 'kops_inventory.json');
    
    // Export the inventory as pretty-printed JSON
    fs.writeFileSync(outputFile, JSON.stringify(inventory, null, 2), 'utf8');
    
    console.log(`Successfully exported ${inventory.length} records to ${outputFile}`);
  } catch (error) {
    console.error("Error exporting inventory:", error);
  }
})();