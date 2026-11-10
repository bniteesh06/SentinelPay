require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const routes = require('./routes');
const { Transaction, User } = require('./models');
const { SEED_TRANSACTIONS, STREAM_POOL } = require('./dataset');
const { evaluateRisk } = require('./fraudEngine');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sentinelpay';

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

let streamInterval = null;
let streamIndex = 0;

io.on('connection', (socket) => {
  console.log(`[Socket] Analyst connected: ${socket.id}`);

  socket.on('start-stream', () => {
    if (streamInterval) clearInterval(streamInterval);
    console.log('[Socket] Live Kaggle-benchmark stream simulation: ACTIVE');

    streamInterval = setInterval(() => {
      const template = STREAM_POOL[streamIndex % STREAM_POOL.length];
      streamIndex++;

      const { riskScore, status, reasons } = evaluateRisk(template);
      const isForeign = template.origin.startsWith('foreign');

      const liveTx = {
        _id: `live-${Date.now()}`,
        transactionId: `TXN-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
        sender: template.sender,
        merchant: template.merchant,
        type: template.type,
        amount: template.amount,
        origin: template.origin,
        country: isForeign ? 'International' : 'Domestic (US)',
        isForeign,
        timeHour: template.timeHour,
        velocity: template.velocity,
        locationMatch: template.locationMatch,
        riskScore,
        status,
        reasons,
        reviewedBy: null,
        reviewedAt: null,
        createdAt: new Date(),
      };

      // Broadcast new transaction to all active dashboards
      io.emit('new-transaction', liveTx);
    }, 3200); // Emits every 3.2 seconds
  });

  socket.on('stop-stream', () => {
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
    console.log('[Socket] Live stream simulation: PAUSED');
    io.emit('stream-status', { active: false });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Analyst disconnected: ${socket.id}`);
  });
});

// MongoDB Connection with Auto-Seeding
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 })
  .then(async (conn) => {
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    try {
      const txCount = await Transaction.countDocuments();
      if (txCount === 0 && SEED_TRANSACTIONS.length > 0) {
        await Transaction.insertMany(SEED_TRANSACTIONS);
        console.log(`[MongoDB] Auto-seeded ${SEED_TRANSACTIONS.length} Kaggle transactions into database.`);
      }
      const userExists = await User.findOne({ email: 'niteesh@sentinelpay.com' });
      if (!userExists) {
        await User.create({
          name: 'Niteesh Balajee',
          email: 'niteesh@sentinelpay.com',
          password: 'admin123',
          role: 'analyst',
        });
        console.log('[MongoDB] Auto-seeded default Analyst account (niteesh@sentinelpay.com)');
      }
    } catch (seedErr) {
      console.warn(`[MongoDB] Auto-seed notice: ${seedErr.message}`);
    }
  })
  .catch((err) => console.warn(`[MongoDB] Running offline fallback (${err.message})`));

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => res.json({
  status: 'online',
  database: mongoose.connection.readyState === 1 ? 'connected' : 'offline-fallback',
  socketClients: io.engine.clientsCount,
}));

// API Routes
app.use('/api', routes);

// Centralized Error Handlers
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

server.listen(PORT, () => {
  console.log(`🚀 SentinelPay API & WebSockets running at http://localhost:${PORT}`);
});

module.exports = server;
