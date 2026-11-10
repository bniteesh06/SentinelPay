
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  LockKeyhole,
  Zap,
} from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">

        <div className="hero-tag">
          <span className="status-dot"></span>
          AI-POWERED PAYMENT SECURITY
        </div>

        <h1>
          Secure Every
          <br />
          <span>Transaction.</span>
          <br />
          Trust Every Payment.
        </h1>

        <p className="hero-description">
          SentinelPay uses intelligent fraud detection and
          real-time monitoring to protect digital payments
          and keep every transaction secure.
        </p>

        <div className="hero-actions">
          <a href="#features" className="primary-btn">
            Explore Features <ArrowRight size={18} />
          </a>

          <a href="#about" className="secondary-btn">
            Discover SentinelPay
          </a>
        </div>

        <div className="hero-trust">
          <div>
            <ShieldCheck size={19} />
            <span>Smart Protection</span>
          </div>

          <div>
            <Activity size={19} />
            <span>Real-Time Monitoring</span>
          </div>

          <div>
            <LockKeyhole size={19} />
            <span>Secure Payments</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="glow-circle"></div>

        <div className="security-card">

          <div className="security-card-top">
            <span className="security-icon">
              <ShieldCheck size={35} />
            </span>

            <span className="live-status">
              <span className="status-dot"></span>
              SYSTEM ACTIVE
            </span>
          </div>

          <div className="security-heading">
            <p>Transaction Security</p>
            <h2>Protected</h2>
            <span>
              Intelligent fraud monitoring enabled
            </span>
          </div>

          <div className="security-divider"></div>

          <div className="security-metrics">
            <div>
              <Activity size={20} />
              <span>Real-time analysis</span>
              <strong>Active</strong>
            </div>

            <div>
              <Zap size={20} />
              <span>Fraud detection</span>
              <strong>Enabled</strong>
            </div>

            <div>
              <LockKeyhole size={20} />
              <span>Payment security</span>
              <strong>Protected</strong>
            </div>
          </div>

          <div className="security-bottom">
            <ShieldCheck size={17} />
            SentinelPay Security Engine
          </div>

        </div>

        <div className="floating-badge">
          <ShieldCheck size={18} />
          <div>
            <strong>Smart Security</strong>
            <span>Always monitoring</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
