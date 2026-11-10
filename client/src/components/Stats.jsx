import React, { useState, useEffect } from 'react';

export default function Stats() {
  const [counts, setCounts] = useState({
    transactions: 0,
    accuracy: 0,
    signals: 0,
  });

  useEffect(() => {
    const targets = { transactions: 10000, accuracy: 99, signals: 4 };
    const duration = 1200; // ms
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        transactions: Math.floor(targets.transactions * progress),
        accuracy: Math.floor(targets.accuracy * progress),
        signals: Math.min(targets.signals, Math.ceil(targets.signals * progress)),
      });

      if (step >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="stats">
      <div className="container stats__inner">
        <div className="stats__text">
          <h2 className="section-heading">Built on real transaction data</h2>
          <p className="section-subheading">
            Trained and tested against 10,000 transaction records
            to catch the patterns that actually show up in real-world fraud.
          </p>
        </div>

        <div className="stats__grid">
          <div className="stat">
            <span className="stat__number">{counts.transactions.toLocaleString()}</span>
            <span className="stat__label">transactions analyzed</span>
          </div>
          <div className="stat">
            <span className="stat__number">{counts.accuracy}</span>
            <span className="stat__suffix">%</span>
            <span className="stat__label">detection accuracy</span>
          </div>
          <div className="stat">
            <span className="stat__number">{counts.signals}</span>
            <span className="stat__label">core detection signals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
