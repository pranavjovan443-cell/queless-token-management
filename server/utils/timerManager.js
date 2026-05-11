const Token = require('../models/Token');

let ioInstance;
let timerInterval;
const SERVING_TIME = 300; // 5 minutes in seconds

const initTimerManager = (io) => {
  ioInstance = io;
  
  // Start background loop for timer logic
  if (!timerInterval) {
    timerInterval = setInterval(async () => {
      try {
        // Skip if database is disconnected
        if (require('mongoose').connection.readyState !== 1) return;

        const activeToken = await Token.findOne({ status: 'serving' });
        
        if (activeToken) {
          if (activeToken.remainingTime > 0) {
            // Decrement timer
            activeToken.remainingTime -= 1;
            await activeToken.save();
            
            // Emit live update
            ioInstance.emit('timerUpdated', {
              tokenNumber: activeToken.tokenNumber,
              remainingTime: activeToken.remainingTime
            });
          } else {
            // Timer ended, move to next
            await startQueueTimer();
          }
        } else {
          // No one serving, check if anyone is waiting to start auto-serve
          const waitingToken = await Token.findOne({ status: 'waiting' }).sort({ tokenNumber: 1 });
          if (waitingToken) {
            await startQueueTimer();
          }
        }
      } catch (error) {
        console.error('Timer Manager Error:', error);
      }
    }, 1000);
  }
};

const startQueueTimer = async (forceNext = false) => {
  try {
    // 1. Complete current token if exists
    if (forceNext) {
      await Token.updateMany(
        { status: 'serving' },
        { status: 'completed', completedAt: new Date(), remainingTime: 0 }
      );
    } else {
      // Logic for automatic transition when timer hits 0
      await Token.updateMany(
        { status: 'serving', remainingTime: { $lte: 0 } },
        { status: 'completed', completedAt: new Date() }
      );
    }

    // 2. Find next waiting token
    const nextToken = await Token.findOne({ status: 'waiting' }).sort({ tokenNumber: 1 });

    if (nextToken) {
      nextToken.status = 'serving';
      nextToken.servingStartedAt = new Date();
      nextToken.remainingTime = SERVING_TIME;
      await nextToken.save();

      // Emit events
      if (ioInstance) {
        ioInstance.emit('tokenServing', nextToken);
        ioInstance.emit('queueUpdated');
      }
      
      return nextToken;
    } else {
      if (ioInstance) ioInstance.emit('queueReset');
      return null;
    }
  } catch (error) {
    console.error('Start Queue Timer Error:', error);
    throw error;
  }
};

const resetSystem = async () => {
  try {
    await Token.deleteMany({});
    if (ioInstance) {
      ioInstance.emit('queueReset');
      ioInstance.emit('queueUpdated');
    }
  } catch (error) {
    console.error('Reset System Error:', error);
    throw error;
  }
};

module.exports = {
  initTimerManager,
  startQueueTimer,
  resetSystem
};
