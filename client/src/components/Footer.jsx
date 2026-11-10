import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="container footer__inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={20} color="#C1401F" />
          <span className="navbar__logo" style={{ color: '#fff' }}>SentinelPay</span>
        </div>
        <p className="footer__meta">
          Full Stack Development (CS3301) • Semester 5 • College Project
        </p>
        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/evaluator">Test Engine</Link>
          <Link to="/dashboard">Alert Queue</Link>
          <a href="#navbar">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
