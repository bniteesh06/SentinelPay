
require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const routes = require('./routes');
const { STREAM_POOL } = require('./dataset');
const { evaluateRisk } = require('./fraudEngine');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/sentinelpay';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

// Temporary simulated transactions.
// Used only when dataset.json is unavailable.
const DEMO_STREAM_POOL = [
  {
    sender: 'Alex Morgan',
    merchant: 'Online Electronics',
    type: 'Shopping',
    amount: 6500,
    origin: 'foreign_high_risk',
    timeHour: 2,
    velocity: 5,
    locationMatch: false,
  },
  {
    sender: 'Sarah Wilson',
    merchant: 'Grocery Store',
    type: 'Groceries',
    amount: 450,
    origin: 'domestic',
    timeHour: 12,
    velocity: 1,
    locationMatch: true,
  },
  {
    sender: 'David Thomas',
    merchant: 'Travel Services',
    type: 'Travel',
    amount: 2800,
    origin: 'foreign',
    timeHour: 3,
    velocity: 2,
    locationMatch: true,
  },
];

const activeStreamPool =
  STREAM_POOL.length > 0 ? STREAM_POOL : DEMO_STREAM_POOL;

let streamInterval = null;
let streamIndex = 0;

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`[Socket] Analyst connected: ${socket.id}`);

  socket.on('start-stream', () => {
    if (streamInterval) {
      clearInterval(streamInterval);
    }

    console.log('[Socket] Live stream: ACTIVE');
    io.emit('stream-status', { active: true });

    streamInterval = setInterval(() => {
      const template =
        activeStreamPool[streamIndex % activeStreamPool.length];

      streamIndex++;

      const { riskScore, status, reasons } =
        evaluateRisk(template);

      const isForeign =
        (template.origin || 'domestic').startsWith('foreign');

      const liveTx = {
        _id: `live-${Date.now()}`,
        transactionId: `TXN-LIVE-${Date.now()}`,
        sender: template.sender,
        merchant: template.merchant,
        type: template.type,
        amount: template.amount,
        origin: template.origin,
        country: isForeign ? 'International' : 'Domestic',
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

      // Send transaction to all connected dashboards
      io.emit('new-transaction', liveTx);

      console.log(
        `[Stream] ${liveTx.transactionId} | ${status} | Risk: ${riskScore}`
      );
    }, 3200);
  });

  socket.on('stop-stream', () => {
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }

    console.log('[Socket] Live stream: PAUSED');
    io.emit('stream-status', { active: false });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Analyst disconnected: ${socket.id}`);
  });
});

// Connect MongoDB
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 })
  .then(() => {
    console.log('[MongoDB] Connected successfully');
  })
  .catch((err) => {
    console.warn(`[MongoDB] Offline fallback: ${err.message}`);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'offline-fallback',
    socketClients: io.engine.clientsCount,
  });
});

// Mount REST API routes
app.use('/api', routes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// Start server
server.listen(PORT, () => {
  console.log(
    `SentinelPay API & WebSockets running at http://localhost:${PORT}`
  );
});

module.exports = server;
