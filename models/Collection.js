// models/Collection.js
const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  records: [{
    id: String,
    artist: String,
    title: String,
    year: Number,
    labels: [String],
    genres: [String],
    styles: [String],
    formats: [mongoose.Schema.Types.Mixed]
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Collection', CollectionSchema);