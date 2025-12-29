const mongoose = require('mongoose');

const CableSchema = new mongoose.Schema({
  cableName: { type: String, required: true },
  description: String,
  dimensions: [{ label: String, value: String }],
  images: [String], // Array to store the 4 Base64 images
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cable', CableSchema);