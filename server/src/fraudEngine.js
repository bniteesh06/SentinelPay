/**
 * Dual-Layer Fraud Detection Engine
 * Combines policy checks with anomaly risk scoring.
 */
function evaluateRisk({ amount, origin, timeHour, velocity, locationMatch }) {
  const amt = parseFloat(amount) || 0;
  const hour = parseInt(timeHour, 10) || 12;
  const vel = parseInt(velocity, 10) || 1;
  const match = locationMatch !== false && locationMatch !== 'false';

  let score = 5;
  const reasons = [];

  // Policy Rules
  if (amt > 5000) { score += 35; reasons.push('High value transaction (> $5,000)'); }
  else if (amt > 2000) { score += 20; reasons.push('Elevated transaction amount (> $2,000)'); }

  if (origin === 'foreign_high_risk') { score += 35; reasons.push('High-risk international IP jurisdiction'); }
  else if (origin === 'foreign') { score += 20; reasons.push('Cross-border foreign card payment'); }

  if (hour >= 1 && hour <= 4) { score += 25; reasons.push(`Unusual midnight hour (${hour}:00 AM)`); }

  if (vel >= 4) { score += 30; reasons.push(`Velocity spike (${vel} txns in 15 mins)`); }
  else if (vel >= 2) { score += 12; reasons.push(`Elevated velocity (${vel} txns)`); }

  if (!match) { score += 25; reasons.push('Billing location and device IP mismatch'); }

  const riskScore = Math.min(Math.max(score, 0), 99);
  const status = riskScore >= 30 ? 'FLAGGED' : 'SAFE';

  return {
    riskScore,
    status,
    reasons: reasons.length ? reasons : ['Standard baseline matched'],
  };
}

module.exports = { evaluateRisk };
