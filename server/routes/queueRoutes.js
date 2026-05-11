const express = require('express');
const router = express.Router();
const { 
  joinQueue, 
  getQueue, 
  getCurrentToken, 
  nextToken, 
  resetQueue,
  getStats
} = require('../controllers/queueController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/join', joinQueue);
router.get('/', getQueue);
router.get('/current', getCurrentToken);
router.get('/stats', getStats);

// Admin routes (Protected)
router.post('/next', protect, nextToken);
router.post('/reset', protect, resetQueue);

module.exports = router;
