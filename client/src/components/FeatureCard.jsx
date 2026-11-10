import React from 'react';

export default function FeatureCard({ icon: Icon, letter, title, description, badge }) {
  return (
    <div className="feature-card">
      <div className="feature-card__icon">
        {Icon ? <Icon size={22} /> : letter}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {badge && (
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <span className="badge badge--neutral">{badge}</span>
        </div>
      )}
    </div>
  );
}
