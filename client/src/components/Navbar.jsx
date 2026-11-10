
import { useState } from "react";
import { ShieldCheck, Menu, X, ArrowUpRight } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
  ];

  return (
    <nav className="navbar">
      <a href="#home" className="brand">
        <span className="brand-icon">
          <ShieldCheck size={23} />
        </span>
        <span>Sentinel<span className="brand-highlight">Pay</span></span>
      </a>

      <button
        className="mobile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
        <a href="#contact" className="nav-cta">
          Get Started <ArrowUpRight size={16} />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
