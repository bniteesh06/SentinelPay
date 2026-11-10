/**
 * Kaggle / Hugging Face Credit Card Fraud Detection Dataset Loader
 * Source: dazzle-nu/CIS435-CreditCardFraudDetection (Kaggle Kartik Shenoy IEEE-CIS Benchmark)
 */
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/dataset.json');
let dataset = { seed: [], stream: [] };

try {
  if (fs.existsSync(dataFilePath)) {
    dataset = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  }
} catch (err) {
  console.warn('[Dataset] Could not read dataset.json, using fallback:', err.message);
}

const SEED_TRANSACTIONS = dataset.seed || [];
const STREAM_POOL = dataset.stream || [];

module.exports = { SEED_TRANSACTIONS, STREAM_POOL };

