
import {
  ShieldCheck,
  BrainCircuit,
  Activity,
  BellRing,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

function Features() {
  const features = [
    {
      icon: <BrainCircuit size={26} />,
      title: "AI-Powered Fraud Detection",
      description:
        "Analyzes transaction patterns and identifies suspicious activities using intelligent fraud scoring.",
    },
    {
      icon: <Activity size={26} />,
      title: "Real-Time Monitoring",
      description:
        "Monitors transactions continuously and provides instant updates through real-time streaming.",
    },
    {
      icon: <ShieldCheck size={26} />,
      title: "Smart Risk Assessment",
      description:
        "Evaluates transaction risk levels to identify potentially fraudulent payments.",
    },
    {
      icon: <BellRing size={26} />,
      title: "Instant Alerts",
      description:
        "Highlights suspicious transactions and helps administrators respond quickly.",
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-heading">
            Security That Works Behind Every Payment
          </h2>

          <p className="section-subheading">
            Powerful features designed to make digital payments
            safer, smarter and more reliable.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
