const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  cableName: { type: String, required: true },
  description: String,
  dimensions: Array,
  images: [String],
  status: { type: String, default: 'Pending' },
  orderId: { type: Number, default: () => Math.floor(1000 + Math.random() * 9000) },
  startTime: Number,
  endTime: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
