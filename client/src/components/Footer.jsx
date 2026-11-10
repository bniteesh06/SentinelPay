
import {
  ShieldCheck,
  Code2,
  BriefcaseBusiness,
  ArrowUp,
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#home" className="brand">
            <span className="brand-icon">
              <ShieldCheck size={23} />
            </span>

            <span>
              Sentinel<span className="brand-highlight">Pay</span>
            </span>
          </a>

          <p>
            Smarter fraud detection.
            Safer digital payments.
            Greater confidence in every transaction.
          </p>

          <div className="footer-socials">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Code2 size={19} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <BriefcaseBusiness size={19} />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-info">
          <h4>Our Focus</h4>
          <span>Fraud Detection</span>
          <span>Transaction Monitoring</span>
          <span>Payment Security</span>
          <span>Risk Assessment</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} SentinelPay.
          All rights reserved.
        </p>

        <a href="#home" className="back-to-top">
          Back to top <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
