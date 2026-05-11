const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: [true, 'User name is required']
  },
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed'],
    default: 'waiting'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  servingStartedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  remainingTime: {
    type: Number,
    default: 300 // 5 minutes in seconds
  }
}, { timestamps: true });

module.exports = mongoose.model('Token', TokenSchema);
