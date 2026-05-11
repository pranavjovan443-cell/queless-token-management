const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/queless';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Pass io to routes
app.set('socketio', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/services', require('./routes/services'));

app.get('/', (req, res) => {
  res.json({ message: 'QueueLess API is running' });
});

// Auto-serve logic (The "Old Version" Feature)
const Token = require('./models/Token');
setInterval(async () => {
  try {
    const branches = ['Main', 'North', 'East']; // Or fetch from DB
    const counters = ['STATION ALPHA', 'STATION BETA', 'STATION GAMMA'];
    const now = new Date();
    
    for (const branch of branches) {
      // 1. Complete tokens that have been serving for more than 5 minutes
      const expiredTokens = await Token.find({ 
        branch, 
        status: 'serving', 
        servedAt: { $lt: new Date(now - 5 * 60 * 1000) } 
      });
      
      for (const token of expiredTokens) {
        token.status = 'completed';
        token.completedAt = now;
        await token.save();
      }

      // 2. Find empty counters and call next tokens
      const currentServing = await Token.find({ branch, status: 'serving' });
      const occupiedCounters = currentServing.map(t => t.counter);
      
      for (const counter of counters) {
        if (!occupiedCounters.includes(counter)) {
          const next = await Token.findOne({ branch, status: 'waiting' })
            .sort({ priority: -1, bookedAt: 1 });
            
          if (next) {
            next.status = 'serving';
            next.servedAt = now;
            next.counter = counter;
            await next.save();
            
            io.to(branch).emit('callToken', next);
            occupiedCounters.push(counter); // Prevent double booking in same loop
          }
        }
      }
    }
  } catch (err) {
    console.error('Auto-serve error:', err);
  }
}, 5000); // Check every 5 seconds

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
