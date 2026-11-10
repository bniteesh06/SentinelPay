import React from 'react';
import { Target, Users, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <h2 className="section-heading">Why we built this</h2>
        <p className="section-subheading">
          Manual fraud review doesn't scale. SentinelPay exists to give reviewers
          a shorter, smarter list—flagged transactions with a clear reason attached,
          instead of a haystack to search by hand.
        </p>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontWeight: 600, marginBottom: '8px' }}>
              <Target size={20} color="var(--color-flag)" /> Zero False Lockouts
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              Avoid hard-blocking honest users. Flag suspicious transactions for review instead of auto-declining immediately.
            </p>
          </div>

          <div style={{ background: '#FFF', padding: '24px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontWeight: 600, marginBottom: '8px' }}>
              <CheckCircle size={20} color="var(--color-safe)" /> Clear Reasoning
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              Every alert explicitly lists each triggered policy rule so analysts make informed, defensible decisions in seconds.
            </p>
          </div>

          <div style={{ background: '#FFF', padding: '24px', borderRadius: '10px', border: '1px solid var(--color-navy)', fontWeight: 600, marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontWeight: 600, marginBottom: '8px' }}>
              <Users size={20} color="var(--color-navy)" /> Human Accountability
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              Full reviewer audit trail for financial compliance, ensuring institutions know exactly who reviewed what and when.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
