
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Activity,
  Users,
  Zap,
} from "lucide-react";

const stats = [
  {
    icon: <ShieldCheck size={25} />,
    value: 99,
    suffix: "%",
    label: "Detection Accuracy",
  },
  {
    icon: <Activity size={25} />,
    value: 24,
    suffix: "/7",
    label: "Real-Time Monitoring",
  },
  {
    icon: <Users size={25} />,
    value: 100,
    suffix: "K+",
    label: "Transactions Analyzed",
  },
  {
    icon: <Zap size={25} />,
    value: 1,
    suffix: " sec",
    label: "Fast Risk Analysis",
  },
];

function Stats() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const duration = 1500;
    const intervalTime = 30;
    const steps = duration / intervalTime;

    const interval = setInterval(() => {
      setCounts((previous) =>
        previous.map((count, index) => {
          const target = stats[index].value;
          const increment = Math.ceil(target / steps);

          return Math.min(count + increment, target);
        })
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="stats-section">
      <div className="stats-heading">
        <span className="section-tag">
          SENTINELPAY AT A GLANCE
        </span>

        <h2>Security Meets Performance</h2>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon">
              {stat.icon}
            </div>

            <h2>
              {counts[index]}
              {stat.suffix}
            </h2>

            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="stats-note">
        Illustrative platform metrics for demonstration purposes.
      </p>
    </section>
  );
}

export default Stats;
