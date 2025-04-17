// models/KopsInventory.js
const mongoose = require('mongoose');

const KopsInventorySchema = new mongoose.Schema({
  records: [{
    url: String,
    artist: String,
    title: String,
    fullTitle: String,
    price: Number,
    imageUrl: String,
    subtitle: String,
    description: String,
    genres: [String],
    format: String,
    condition: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('KopsInventory', KopsInventorySchema);