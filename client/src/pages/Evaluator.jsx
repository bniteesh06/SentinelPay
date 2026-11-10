import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

export default function Evaluator() {
  const navigate = useNavigate();
  const { addTransaction, isServerConnected } = useTransactions();
  const [form, setForm] = useState({
    sender: '',
    amount: '',
    origin: 'domestic',
    timeHour: '14',
    velocity: '1',
    locationMatch: true,
  });
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEvaluate = (e) => {
    e.preventDefault();
    setIsAdded(false);

    const amt = parseFloat(form.amount) || 0;
    const hour = parseInt(form.timeHour, 10);
    const vel = parseInt(form.velocity, 10);

    let score = 5;
    const reasons = [];

    if (amt > 5000) { score += 35; reasons.push('High value transaction (> $5,000)'); }
    else if (amt > 2000) { score += 20; reasons.push('Elevated amount (> $2,000)'); }

    if (form.origin === 'foreign_high_risk') { score += 35; reasons.push('High-risk international jurisdiction'); }
    else if (form.origin === 'foreign') { score += 20; reasons.push('Cross-border foreign card payment'); }

    if (hour >= 1 && hour <= 4) { score += 25; reasons.push(`Unusual midnight hour (${hour}:00 AM)`); }

    if (vel >= 4) { score += 30; reasons.push(`Velocity spike (${vel} txns / 15m)`); }
    else if (vel >= 2) { score += 12; reasons.push(`Elevated velocity (${vel} txns)`); }

    if (!form.locationMatch) { score += 25; reasons.push('Billing location and device IP mismatch'); }

    const riskScore = Math.min(score, 99);

    setResult({
      transactionId: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      sender: form.sender,
      amount: amt,
      origin: form.origin,
      country: form.origin.startsWith('foreign') ? 'International' : 'Domestic',
      riskScore,
      status: riskScore >= 30 ? 'FLAGGED' : 'SAFE',
      reasons: reasons.length ? reasons : ['Standard baseline matched'],
    });
  };

  const handleQueue = async () => {
    if (!result) return;
    setIsSubmitting(true);
    await addTransaction(result);
    setIsSubmitting(false);
    setIsAdded(true);
  };

  const handleReset = () => {
    setForm({ sender: '', amount: '', origin: 'domestic', timeHour: '14', velocity: '1', locationMatch: true });
    setResult(null);
    setIsAdded(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge--neutral">Module 5 • Evaluator</span>
            <span className={`badge ${isServerConnected ? 'badge--safe' : 'badge--warning'}`}>
              {isServerConnected ? 'API Connected' : 'Local Mode'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginTop: '8px' }}>Transaction Risk Evaluator</h1>
          <p className="section-subheading">Test SentinelPay's dual-layer scoring engine in real-time.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px', alignItems: 'start' }}>
          {/* Form */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Parameters</h3>
            <form onSubmit={handleEvaluate}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Cardholder Name</label>
                  <input name="sender" required placeholder="e.g. Rachel Adams" value={form.sender} onChange={onChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (USD $)</label>
                  <input name="amount" type="number" step="0.01" min="1" required placeholder="e.g. 1499.00" value={form.amount} onChange={onChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Card Origin & IP</label>
                  <select name="origin" value={form.origin} onChange={onChange} className="form-select">
                    <option value="domestic">Domestic (Verified)</option>
                    <option value="foreign">Cross-Border</option>
                    <option value="foreign_high_risk">High Risk Geo / VPN</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time of Transaction</label>
                  <select name="timeHour" value={form.timeHour} onChange={onChange} className="form-select">
                    <option value="2">02:00 AM (Midnight)</option>
                    <option value="10">10:00 AM (Day)</option>
                    <option value="14">02:00 PM (Afternoon)</option>
                    <option value="20">08:00 PM (Evening)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Velocity (15 min)</label>
                  <select name="velocity" value={form.velocity} onChange={onChange} className="form-select">
                    <option value="1">1 txn (Normal)</option>
                    <option value="2">2 txns (Moderate)</option>
                    <option value="4">4+ txns (Spike)</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="checkbox-group">
                    <input type="checkbox" name="locationMatch" checked={form.locationMatch} onChange={onChange} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>GPS matches billing address</span>
                  </label>
                </div>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>Run Fraud Engine <ArrowRight size={16} /></button>
                <button type="button" onClick={handleReset} className="btn btn--outline" title="Reset"><RotateCcw size={16} /></button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <div className="card">
                <div className="result-header">
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Reference</span>
                    <h3 style={{ fontFamily: 'monospace' }}>{result.transactionId}</h3>
                  </div>
                  <span className={`badge ${result.riskScore >= 60 ? 'badge--flag' : result.riskScore >= 30 ? 'badge--warning' : 'badge--safe'}`}>
                    {result.riskScore >= 30 ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                    {result.riskScore >= 60 ? 'FLAGGED' : result.riskScore >= 30 ? 'SUSPICIOUS' : 'APPROVED'}
                  </span>
                </div>

                <div style={{ margin: '18px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem' }}>
                    <span>Fraud Risk Score</span>
                    <span>{result.riskScore}%</span>
                  </div>
                  <div className="score-bar-bg">
                    <div className="score-bar-fill" style={{
                      width: `${result.riskScore}%`,
                      backgroundColor: result.riskScore >= 60 ? 'var(--color-flag)' : result.riskScore >= 30 ? 'var(--color-warning)' : 'var(--color-safe)'
                    }} />
                  </div>
                </div>

                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Triggered Signals</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.reasons.map((r, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', padding: '6px 10px', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                      • {r}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: '24px' }}>
                  {isAdded ? (
                    <button className="btn btn--navy" style={{ width: '100%' }} onClick={() => navigate('/dashboard')}>
                      View in Alert Queue <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button className="btn btn--navy" style={{ width: '100%' }} disabled={isSubmitting} onClick={handleQueue}>
                      {isSubmitting ? 'Saving...' : 'Push to Reviewer Queue'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-muted)' }}>
                <ShieldCheck size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <h3>Engine Idle</h3>
                <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>Fill in parameters and click "Run Fraud Engine" to score.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

