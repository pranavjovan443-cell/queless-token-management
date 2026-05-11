const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  branchName: { type: String, required: true, unique: true },
  location: { type: String },
  isActive: { type: Boolean, default: true },
  avgServiceTime: { type: Number, default: 10 }, // base service time in minutes
  lastTokenNumber: { type: Number, default: 0 },
  prefix: { type: String, default: 'TK' },
  settings: {
    allowPriority: { type: Boolean, default: true },
    autoCall: { type: Boolean, default: false }
  },
  stats: {
    totalTokensToday: { type: Number, default: 0 },
    avgWaitTimeToday: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Queue', queueSchema);
