
/**
 * SentinelPay - Fraud Scoring Engine
 * Rule-based transaction risk evaluation.
 */

const evaluateRisk = (transaction) => {
  let score = 5;
  const reasons = [];

  const {
    amount,
    origin,
    timeHour,
    velocity,
    locationMatch
  } = transaction;

  // Rule 1: Transaction amount
  if (amount > 5000) {
    score += 35;
    reasons.push("High transaction amount");
  } else if (amount > 2000) {
    score += 20;
    reasons.push("Unusually large transaction");
  }

  // Rule 2: Transaction origin
  if (origin === "foreign_high_risk") {
    score += 35;
    reasons.push("High-risk foreign transaction");
  } else if (origin === "foreign") {
    score += 20;
    reasons.push("Foreign transaction");
  }

  // Rule 3: Unusual transaction time (1 AM–4 AM)
  if (timeHour >= 1 && timeHour <= 4) {
    score += 25;
    reasons.push("Transaction during unusual hours");
  }

  // Rule 4: Transaction velocity
  if (velocity >= 4) {
    score += 30;
    reasons.push("High transaction frequency");
  } else if (velocity >= 2) {
    score += 12;
    reasons.push("Multiple recent transactions");
  }

  // Rule 5: Location mismatch
  if (locationMatch === false) {
    score += 25;
    reasons.push("Transaction location mismatch");
  }

  // Keep risk score between 0 and 99
  score = Math.min(score, 99);

  // Classify transaction
  const status = score >= 30 ? "FLAGGED" : "SAFE";

  return {
    riskScore: score,
    status,
    reasons
  };
};

module.exports = { evaluateRisk };
