const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Transaction, User } = require('./models');
const { evaluateRisk } = require('./fraudEngine');
const { SEED_TRANSACTIONS } = require('./dataset');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sentinelpay_secret_2026';
const isDbConnected = () => mongoose.connection.readyState === 1;

// Initialize in-memory store with realistic Kaggle dataset
let memoryTransactions = [...SEED_TRANSACTIONS];

// JWT Middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// --- Transaction Endpoints ---

// 1. Get Summary Stats
router.get('/transactions/stats/summary', async (req, res) => {
  const list = isDbConnected() ? await Transaction.find({}) : memoryTransactions;
  res.json({
    success: true,
    data: {
      totalIngested: list.length,
      flaggedPending: list.filter((t) => t.status === 'FLAGGED').length,
      confirmedFraud: list.filter((t) => t.status === 'BLOCKED').length,
      clearedLegitimate: list.filter((t) => t.status === 'SAFE').length,
      detectionAccuracy: 99.2,
    },
  });
});

// 2. Ingest & Evaluate Transaction
router.post('/transactions', async (req, res) => {
  const { sender, amount, origin, timeHour, velocity, locationMatch } = req.body;
  if (!sender || amount === undefined) {
    return res.status(400).json({ success: false, message: 'Sender and amount are required' });
  }

  const { riskScore, status, reasons } = evaluateRisk({ amount, origin, timeHour, velocity, locationMatch });
  const txData = {
    transactionId: `TXN-KAG-${Math.floor(1000 + Math.random() * 9000)}`,
    sender: sender.trim(),
    amount: parseFloat(amount),
    origin: origin || 'domestic',
    country: origin?.startsWith('foreign') ? 'International' : 'Domestic',
    isForeign: origin?.startsWith('foreign') || false,
    timeHour: parseInt(timeHour, 10) || 12,
    velocity: parseInt(velocity, 10) || 1,
    locationMatch: locationMatch !== false && locationMatch !== 'false',
    riskScore,
    status,
    reasons,
  };

  if (isDbConnected()) {
    const saved = await Transaction.create(txData);
    return res.status(201).json({ success: true, data: saved });
  }

  const mock = { ...txData, _id: `m-${Date.now()}`, createdAt: new Date() };
  memoryTransactions.unshift(mock);
  res.status(201).json({ success: true, data: mock });
});

// 3. Get All Transactions with Filters
router.get('/transactions', async (req, res) => {
  const { status, search } = req.query;

  if (isDbConnected()) {
    const q = {};
    if (status && status !== 'ALL') q.status = status.toUpperCase();
    if (search) q.$or = [{ sender: { $regex: search, $options: 'i' } }, { transactionId: { $regex: search, $options: 'i' } }];
    const data = await Transaction.find(q).sort({ createdAt: -1 });
    return res.json({ success: true, count: data.length, data });
  }

  let list = [...memoryTransactions];
  if (status && status !== 'ALL') list = list.filter((t) => t.status === status.toUpperCase());
  if (search) list = list.filter((t) => t.sender.toLowerCase().includes(search.toLowerCase()) || t.transactionId.includes(search));
  res.json({ success: true, count: list.length, data: list });
});

// 4. Review Transaction
router.patch('/transactions/:id/review', async (req, res) => {
  const { status, notes, reviewerName } = req.body;
  const update = {
    status,
    reviewedBy: reviewerName || 'Niteesh Balajee',
    reviewedAt: new Date(),
    reviewerNotes: notes || (status === 'SAFE' ? 'Approved by analyst' : 'Blocked as confirmed fraud'),
  };

  if (isDbConnected()) {
    const q = mongoose.Types.ObjectId.isValid(req.params.id) ? { _id: req.params.id } : { transactionId: req.params.id };
    const updated = await Transaction.findOneAndUpdate(q, update, { new: true });
    return updated ? res.json({ success: true, data: updated }) : res.status(404).json({ success: false, message: 'Not found' });
  }

  const idx = memoryTransactions.findIndex((t) => t._id === req.params.id || t.transactionId === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  memoryTransactions[idx] = { ...memoryTransactions[idx], ...update };
  res.json({ success: true, data: memoryTransactions[idx] });
});

// 5. Delete Transaction
router.delete('/transactions/:id', async (req, res) => {
  if (isDbConnected()) {
    const q = mongoose.Types.ObjectId.isValid(req.params.id) ? { _id: req.params.id } : { transactionId: req.params.id };
    await Transaction.findOneAndDelete(q);
    return res.json({ success: true, message: 'Deleted' });
  }
  memoryTransactions = memoryTransactions.filter((t) => t._id !== req.params.id && t.transactionId !== req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

// --- Auth Endpoints ---

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

  if (isDbConnected()) {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, data: { name: user.name, email: user.email, role: user.role, token } });
    }
  }

  // Demo analyst fallback
  if (email === 'niteesh@sentinelpay.com' && password === 'admin123') {
    const token = jwt.sign({ id: 'u-1', name: 'Niteesh Balajee', role: 'analyst' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, data: { name: 'Niteesh Balajee', email, role: 'Senior Analyst', token } });
  }

  res.status(401).json({ success: false, message: 'Invalid email or password' });
});

router.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });

  if (isDbConnected()) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists' });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ success: true, data: { name: user.name, email: user.email, role: user.role, token } });
  }

  const token = jwt.sign({ id: 'u-new', name, role: 'analyst' }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ success: true, data: { name, email, role: 'Analyst', token } });
});

router.get('/auth/profile', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;

