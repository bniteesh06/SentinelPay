import React from 'react';
import FeatureCard from './FeatureCard';
import { ShieldCheck, Cpu, LayoutList, History } from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: ShieldCheck,
      letter: 'R',
      title: 'Rule-based checks',
      description: 'Foreign transactions, location mismatches, unusual hours, and velocity spikes are caught instantly using clear, explainable rules.',
      badge: 'Layer 1: Deterministic',
    },
    {
      icon: Cpu,
      letter: 'M',
      title: 'ML risk scoring',
      description: 'A trained statistical model scores anomalies rules alone would miss, learning from thousands of historical transaction patterns.',
      badge: 'Layer 2: Statistical',
    },
    {
      icon: LayoutList,
      letter: 'A',
      title: 'Alert dashboard',
      description: 'Flagged transactions land in one unified queue, sorted by risk, highlighting the exact criteria that triggered the alert.',
      badge: 'Human-in-the-Loop',
    },
    {
      icon: History,
      letter: 'L',
      title: 'Audit history',
      description: 'Every decision—fraud or legitimate—is logged with reviewer identity, timestamp, and reasoning for institutional accountability.',
      badge: 'Compliance & Audit',
    },
  ];

  return (
    <section id="features">
      <div className="container">
        <h2 className="section-heading">How SentinelPay decides what to flag</h2>
        <p className="section-subheading">
          Two layers of detection working together, not one black box.
        </p>

        <div className="feature-grid">
          {featureList.map((f, idx) => (
            <FeatureCard
              key={idx}
              icon={f.icon}
              letter={f.letter}
              title={f.title}
              description={f.description}
              badge={f.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
