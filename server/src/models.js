const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Transaction Schema
const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    sender: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    origin: { type: String, enum: ['domestic', 'foreign', 'foreign_high_risk'], default: 'domestic' },
    country: { type: String, default: 'Domestic' },
    isForeign: { type: Boolean, default: false },
    timeHour: { type: Number, min: 0, max: 23, default: 12 },
    velocity: { type: Number, default: 1, min: 1 },
    locationMatch: { type: Boolean, default: true },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: ['SAFE', 'FLAGGED', 'BLOCKED'], default: 'SAFE', index: true },
    reasons: { type: [String], default: [] },
    reviewedBy: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
    reviewerNotes: { type: String, default: null },
  },
  { timestamps: true }
);

// Reviewer / Analyst Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['analyst', 'admin'], default: 'analyst' },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const Transaction = mongoose.model('Transaction', transactionSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Transaction, User };

