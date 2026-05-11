const Token = require('../models/Token');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client Connected: ${socket.id}`);

    // Send initial state to the connected client
    socket.on('getInitialState', async () => {
      try {
        const queue = await Token.find({ status: { $in: ['waiting', 'serving'] } })
          .sort({ tokenNumber: 1 });
        const current = await Token.findOne({ status: 'serving' });
        
        socket.emit('initialData', { queue, current });
      } catch (error) {
        console.error('Socket Initial State Error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client Disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
