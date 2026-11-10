import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Shield, Menu, X, User, LogOut, Radio } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { flaggedCount, isServerConnected, isStreaming } = useTransactions();
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header id="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <Shield className="logo-icon" size={24} color="#C1401F" />
          <span>SentinelPay</span>
        </Link>

        <nav className={`navbar__links ${isOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <a href="/#features" onClick={closeMenu}>
            How it works
          </a>
          <NavLink to="/evaluator" onClick={closeMenu}>
            Test Transaction
          </NavLink>
          <NavLink to="/dashboard" onClick={closeMenu}>
            Alert Queue
            {flaggedCount > 0 && (
              <span className="navbar__badge">{flaggedCount}</span>
            )}
          </NavLink>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Live Feed Status Pill */}
          {isStreaming && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#FEE2E2', color: '#991B1B', padding: '3px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
              <Radio size={12} className="live-pulse" /> LIVE STREAM
            </div>
          )}

          {/* Connection Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '999px',
              background: isServerConnected ? '#ECFDF5' : '#FEF3C7',
              color: isServerConnected ? '#065F46' : '#92400E',
              border: `1px solid ${isServerConnected ? '#A7F3D0' : '#FDE68A'}`,
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: isServerConnected ? '#10B981' : '#F59E0B' }} />
            {isServerConnected ? 'WebSocket' : 'Local'}
          </div>

          {/* Analyst Auth Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, background: '#F1F5F9', padding: '5px 10px', borderRadius: '6px' }}>
                <User size={14} color="var(--color-navy)" />
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="btn btn--sm btn--outline"
                style={{ padding: '6px 8px' }}
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar__cta" style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
              Analyst Login
            </Link>
          )}
        </div>

        <button
          className="navbar__toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
