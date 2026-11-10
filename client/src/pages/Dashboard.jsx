import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Search, RefreshCw, UserCheck, Download, Radio, ShieldAlert } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { transactions, reviewTransaction, isLoading, refresh, isStreaming, toggleStream, streamAlert } = useTransactions();
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    const id = t.transactionId || t.id || '';
    const name = t.sender || '';
    const matchFilter = filter === 'ALL' || t.status === filter;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pending = transactions.filter((t) => t.status === 'FLAGGED').length;
  const blocked = transactions.filter((t) => t.status === 'BLOCKED').length;
  const safe = transactions.filter((t) => t.status === 'SAFE').length;

  // Feature 5: Export Audit Log to CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Timestamp', 'Cardholder', 'Amount ($)', 'Country', 'Risk Score (%)', 'Status', 'Triggered Signals', 'Reviewed By', 'Reviewed At', 'Analyst Notes'];
    const rows = transactions.map((t) => [
      t.transactionId || t.id,
      t.createdAt ? new Date(t.createdAt).toISOString() : t.timestamp || 'N/A',
      `"${t.sender || 'Unknown'}"`,
      t.amount || 0,
      `"${t.country || 'Domestic'}"`,
      t.riskScore || 0,
      t.status || 'SAFE',
      `"${(t.reasons || []).join('; ')}"`,
      `"${t.reviewedBy || 'Unreviewed'}"`,
      `"${t.reviewedAt || 'N/A'}"`,
      `"${t.reviewerNotes || 'None'}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SentinelPay_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Floating Live Alert Toast */}
        {streamAlert && (
          <div style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 100,
            background: '#FEF2F2',
            border: '1px solid #F87171',
            borderRadius: '10px',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <ShieldAlert size={24} color="#DC2626" />
            <div>
              <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '0.88rem' }}>
                LIVE FRAUD ALERT TRIGGERED
              </div>
              <div style={{ fontSize: '0.82rem', color: '#7F1D1D' }}>
                {streamAlert.sender} • ${streamAlert.amount?.toLocaleString()} • {streamAlert.country} ({streamAlert.riskScore}% Risk)
              </div>
            </div>
          </div>
        )}

        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge--neutral">Kaggle-Benchmark Stream</span>
              {isAuthenticated ? (
                <span className="badge badge--safe">Analyst: {user.name}</span>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <span className="badge badge--warning">Guest Mode (Click to Sign In)</span>
                </Link>
              )}
            </div>
            <h1 style={{ fontSize: '2.2rem', marginTop: '6px' }}>Fraud Alert Queue & Audit Trail</h1>
            <p className="section-subheading">Triage flagged transactions, simulate real-time feeds, and export audit reports.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Feature 1: Live Stream Simulator Toggle */}
            <button
              onClick={toggleStream}
              className={`btn btn--sm ${isStreaming ? 'btn--primary' : 'btn--outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Radio size={14} className={isStreaming ? 'live-pulse' : ''} />
              {isStreaming ? 'Pause Feed' : 'Simulate Live Feed'}
            </button>

            {/* Feature 5: Export CSV Report */}
            <button
              onClick={handleExportCSV}
              className="btn btn--sm btn--outline"
              title="Export Compliance Audit Log"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export CSV
            </button>
            <button onClick={refresh} className="btn btn--sm btn--outline" title="Refresh"><RefreshCw size={14} /></button>
            <Link to="/evaluator" className="btn btn--sm btn--navy">+ New Test</Link>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>TOTAL INGESTED</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '4px' }}>{transactions.length}</h2>
          </div>
          <div className="card" style={{ padding: '16px', borderColor: pending ? 'var(--color-flag)' : 'var(--color-border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-flag)' }}>NEEDS REVIEW</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--color-flag)' }}>{pending}</h2>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: '#B91C1C' }}>CONFIRMED FRAUD</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '4px', color: '#B91C1C' }}>{blocked}</h2>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-safe)' }}>CLEARED (SAFE)</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--color-safe)' }}>{safe}</h2>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'FLAGGED', 'BLOCKED', 'SAFE'].map((f) => (
              <button
                key={f}
                className={`btn btn--sm ${filter === f ? 'btn--navy' : 'btn--outline'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'FLAGGED' ? `Needs Review (${pending})` : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search sender or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '32px' }}
            />
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Sender / Cardholder</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Triggered Signals</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Analyst Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading transactions...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--color-muted)' }}>No records match filter.</td></tr>
              ) : (
                filtered.map((tx) => {
                  const id = tx.transactionId || tx.id;
                  const key = tx._id || id;
                  return (
                    <tr key={key}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{tx.sender}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{tx.country}</div>
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        ${tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: tx.riskScore >= 60 ? 'var(--color-flag)' : tx.riskScore >= 30 ? 'var(--color-warning)' : 'var(--color-safe)' }}>
                          {tx.riskScore}%
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '300px' }}>
                          {tx.reasons?.map((r, i) => (
                            <span key={i} style={{ fontSize: '0.75rem', color: '#475569' }}>• {r}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${tx.status === 'FLAGGED' ? 'badge--flag' : tx.status === 'BLOCKED' ? 'badge--neutral' : 'badge--safe'}`}>
                          {tx.status}
                        </span>
                        {tx.reviewedBy && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                            by {tx.reviewedBy}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {tx.status === 'FLAGGED' ? (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => reviewTransaction(id, 'SAFE')}
                              className="btn btn--sm btn--outline"
                              style={{ color: 'var(--color-safe)', borderColor: 'var(--color-safe)' }}
                              title="Clear as Legitimate"
                            >
                              <CheckCircle2 size={13} /> Clear
                            </button>
                            <button
                              onClick={() => reviewTransaction(id, 'BLOCKED')}
                              className="btn btn--sm btn--primary"
                              title="Confirm Fraud & Block"
                            >
                              <XCircle size={13} /> Block
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                            <UserCheck size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            Logged
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

