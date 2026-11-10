
import {
  ShieldCheck,
  Target,
  Eye,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

function About() {
  return (
    <section className="about-section section" id="about">

      <div className="about-visual">
        <div className="about-glow"></div>

        <div className="about-card">
          <div className="about-card-icon">
            <ShieldCheck size={48} />
          </div>

          <h3>SentinelPay</h3>
          <p>Intelligent Payment Protection</p>

          <div className="about-card-line"></div>

          <div className="about-card-status">
            <span className="status-dot"></span>
            Security-focused architecture
          </div>
        </div>

        <div className="about-floating">
          <Cpu size={21} />
          <span>Intelligent Security</span>
        </div>
      </div>

      <div className="about-content">
        <span className="section-tag">ABOUT SENTINELPAY</span>

        <h2>
          Making Digital Payments
          <span> Safer and Smarter.</span>
        </h2>

        <p>
          SentinelPay is a payment security project designed
          to identify potentially fraudulent transactions
          using intelligent fraud scoring and real-time
          monitoring.
        </p>

        <p>
          By combining transaction analysis, risk assessment
          and instant updates, SentinelPay aims to improve
          visibility into suspicious payment activities.
        </p>

        <div className="about-points">
          <div>
            <Target size={22} />
            <div>
              <h4>Our Mission</h4>
              <p>Improve trust and safety in digital payments.</p>
            </div>
          </div>

          <div>
            <Eye size={22} />
            <div>
              <h4>Our Vision</h4>
              <p>Make transaction monitoring smarter and clearer.</p>
            </div>
          </div>
        </div>

        <a href="#features" className="about-link">
          Explore our features <ArrowUpRight size={18} />
        </a>
      </div>

    </section>
  );
}

export default About;
