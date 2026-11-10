import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Cpu, Activity } from 'lucide-react';

export default function Hero() {
  const nodes = [
    { id: '#901', status: 'safe' },
    { id: '#902', status: 'safe' },
    { id: '#903', status: 'flag' },
    { id: '#904', status: 'safe' },
    { id: '#905', status: 'safe' },
    { id: '#906', status: 'safe' },
    { id: '#907', status: 'flag' },
    { id: '#908', status: 'safe' },
    { id: '#909', status: 'safe' },
    { id: '#910', status: 'safe' },
    { id: '#911', status: 'safe' },
    { id: '#912', status: 'flag' },
  ];

  return (
    <section id="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1 className="hero__headline">
            Every transaction tells a story.<br />
            Some of them are lying.
          </h1>
          <p className="hero__subtext">
            SentinelPay scores every transaction the moment it happens,
            combining rule-based checks with machine learning to flag
            what looks wrong, so your team only reviews what matters.
          </p>

          <div className="hero__actions">
            <Link to="/evaluator" className="btn btn--primary">
              Test Fraud Engine <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn--ghost">
              Open Review Queue
            </Link>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="visual-header">
            <div className="visual-title">
              <span className="live-pulse"></span> Live Ingestion Stream
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
              Dual Layer Active
            </div>
          </div>

          <div className="tx-grid">
            {nodes.map((n, idx) => (
              <div key={idx} className="tx-node-card">
                <div className={`tx-node tx-node--${n.status}`} />
                <span className="tx-node-id">{n.id}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
            <span><strong style={{ color: '#12857A' }}>●</strong> Safe: 75%</span>
            <span><strong style={{ color: '#C1401F' }}>●</strong> Flagged: 25%</span>
            <span>Avg Latency: 12ms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
