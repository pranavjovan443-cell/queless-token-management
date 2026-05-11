const Token = require('../models/Token');
const { startQueueTimer, resetSystem } = require('../utils/timerManager');

// @desc    Join queue
// @route   POST /api/queue/join
// @access  Public
const joinQueue = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    // Calculate next token number
    const lastToken = await Token.findOne().sort({ createdAt: -1 });
    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const token = await Token.create({
      tokenNumber,
      name,
      status: 'waiting'
    });

    // Check if queue should start automatically
    const activeToken = await Token.findOne({ status: 'serving' });
    if (!activeToken) {
      // Logic to start serving this token will be handled by the timer manager or a hook
      // For now, we return the token and the timer manager's interval will pick it up
    }

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all waiting and serving tokens
// @route   GET /api/queue
// @access  Public
const getQueue = async (req, res) => {
  try {
    const queue = await Token.find({ status: { $in: ['waiting', 'serving'] } })
      .sort({ tokenNumber: 1 });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get currently serving token
// @route   GET /api/queue/current
// @access  Public
const getCurrentToken = async (req, res) => {
  try {
    const current = await Token.findOne({ status: 'serving' });
    res.json(current || { message: 'No token being served' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Move to next token
// @route   POST /api/queue/next
// @access  Private (Admin)
const nextToken = async (req, res) => {
  try {
    // We import the trigger from timerManager to ensure state consistency
    const next = await startQueueTimer(true); // true forces next
    res.json(next);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset entire queue
// @route   POST /api/queue/reset
// @access  Private (Admin)
const resetQueue = async (req, res) => {
  try {
    await resetSystem();
    res.json({ message: 'System sequence reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get queue statistics
// @route   GET /api/queue/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const waiting = await Token.countDocuments({ status: 'waiting' });
    const completed = await Token.countDocuments({ status: 'completed' });
    res.json({
      totalWaiting: waiting,
      totalCompleted: completed,
      estimatedWaitTime: waiting * 5 // 5 mins per person
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  joinQueue,
  getQueue,
  getCurrentToken,
  nextToken,
  resetQueue,
  getStats
};
