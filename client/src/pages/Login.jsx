import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('niteesh@sentinelpay.com');
    setPassword('admin123');
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '36px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', padding: '12px', background: '#FEE2E2', borderRadius: '50%', marginBottom: '12px' }}>
              <Shield size={32} color="#C1401F" />
            </div>
            <h2>Analyst Sign In</h2>
            <p className="section-subheading" style={{ fontSize: '0.9rem', margin: '4px auto 0' }}>
              Access the SentinelPay review queue & triage engine
            </p>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#FEE2E2', color: '#991B1B', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '18px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="analyst@sentinelpay.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '34px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '34px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn--primary" style={{ width: '100%', marginTop: '6px' }}>
              {loading ? 'Authenticating...' : 'Sign In as Analyst'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Demo Auto-Fill Shortcut */}
          <div style={{ marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>
              Presentation Shortcut:
            </span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="btn btn--sm btn--outline"
              style={{ width: '100%', fontSize: '0.82rem' }}
            >
              <CheckCircle2 size={13} color="var(--color-safe)" /> Auto-fill Demo Analyst (Niteesh)
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
            Need a reviewer account?{' '}
            <Link to="/register" style={{ color: 'var(--color-navy)', fontWeight: 600, textDecoration: 'none' }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

