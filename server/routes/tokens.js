const express = require('express');
const Token = require('../models/Token');
const Queue = require('../models/Queue');
const router = express.Router();

// Helper to calculate wait time (Basic AI logic)
const predictWaitTime = async (branch) => {
  const waitingTokens = await Token.countDocuments({ branch, status: 'waiting' });
  const queue = await Queue.findOne({ branchName: branch });
  const baseTime = queue ? queue.avgServiceTime : 10;
  
  // Simple AI: Base time * people ahead + small variance
  return waitingTokens * baseTime;
};

// Book a token
router.post('/book', async (req, res) => {
  try {
    const { guestName, userId, branch, priority, serviceType, sessionId } = req.body;

    // Mock data fallback if database is disconnected
    if (require('mongoose').connection.readyState !== 1) {
      const mockToken = {
        tokenNumber: priority ? `P-999` : `T-001`,
        guestName,
        branch,
        priority,
        serviceType: serviceType || 'General',
        estimatedWaitTime: 10,
        bookedAt: new Date(),
        id: Date.now().toString()
      };
      console.log('📝 DEMO MODE: Generated Mock Token');
      return res.status(201).json(mockToken);
    }
    
    let queue = await Queue.findOne({ branchName: branch });
    if (!queue) {
      queue = new Queue({ branchName: branch });
      await queue.save();
    }

    queue.lastTokenNumber += 1;
    const prefix = priority ? 'P' : (queue.prefix || 'T');
    const tokenNumber = `${prefix}-${queue.lastTokenNumber.toString().padStart(3, '0')}`;
    
    const waitTime = await predictWaitTime(branch);
    
    const token = new Token({
      tokenNumber,
      user: userId,
      guestName,
      branch,
      priority,
      serviceType: serviceType || 'General',
      estimatedWaitTime: waitTime,
      sessionId: sessionId || null
    });

    await token.save();
    await queue.save();

    // Broadcast update
    const io = req.app.get('socketio');
    io.to(branch).emit('token_added', token);
    
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Recall token (megaphone)
router.post('/recall/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (token) {
      const io = req.app.get('socketio');
      io.to(token.branch).emit('callToken', token);
      res.json({ message: 'Token recalled' });
    } else {
      res.status(404).json({ message: 'Token not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ping user (direct notification)
router.post('/ping/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (token && token.sessionId) {
      const io = req.app.get('socketio');
      io.to(token.branch).emit('userPing', { sessionId: token.sessionId, tokenNumber: token.tokenNumber });
      res.json({ message: 'User pinged' });
    } else {
      res.status(404).json({ message: 'User not reachable' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Analytics: Get throughput and distribution
router.get('/analytics/:branch', async (req, res) => {
  try {
    const { branch } = req.params;

    // Mock data fallback if database is disconnected
    if (require('mongoose').connection.readyState !== 1) {
      return res.json({ 
        serviceCounts: { 'General': 10, 'Technical': 5, 'Priority': 3 }, 
        hourlyData: { '9': 2, '10': 5, '11': 8, '12': 4 } 
      });
    }

    const allTokens = await Token.find({ branch });
    
    const serviceCounts = allTokens.reduce((acc, t) => {
      acc[t.serviceType] = (acc[t.serviceType] || 0) + 1;
      return acc;
    }, {});
    
    const completed = allTokens.filter(t => t.status === 'completed');
    const hourlyData = completed.reduce((acc, t) => {
      const hour = new Date(t.completedAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    res.json({ serviceCounts, hourlyData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset logic
router.post('/reset', async (req, res) => {
  try {
    const { branch } = req.body;
    
    // Mock data fallback if database is disconnected
    if (require('mongoose').connection.readyState !== 1) {
      const io = req.app.get('socketio');
      io.to(branch).emit('now_serving', null);
      return res.json({ message: 'Queue reset successfully (DEMO MODE)' });
    }

    await Token.deleteMany({ branch });
    const queue = await Queue.findOne({ branchName: branch });
    if (queue) {
      queue.lastTokenNumber = 0;
      await queue.save();
    }
    const io = req.app.get('socketio');
    io.to(branch).emit('now_serving', null);
    res.json({ message: 'Queue reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get live queue for a branch
router.get('/live/:branch', async (req, res) => {
  try {
    const { branch } = req.params;

    // Mock data fallback if database is disconnected
    if (require('mongoose').connection.readyState !== 1) {
      return res.json({ 
        nowServing: { tokenNumber: 'T-001', guestName: 'Demo User', counter: 'STATION ALPHA', serviceType: 'General' }, 
        waiting: [
          { _id: 'w1', tokenNumber: 'T-002', guestName: 'Waiting User 1' },
          { _id: 'w2', tokenNumber: 'T-003', guestName: 'Waiting User 2' }
        ], 
        totalWaiting: 2 
      });
    }

    const tokens = await Token.find({ branch, status: { $in: ['waiting', 'calling', 'serving'] } })
      .sort({ priority: -1, bookedAt: 1 });
    
    const nowServing = tokens.find(t => t.status === 'serving' || t.status === 'calling');
    const waiting = tokens.filter(t => t.status === 'waiting');

    res.json({ nowServing, waiting, totalWaiting: waiting.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
