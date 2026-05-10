import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      '.navbar',
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.8 }
    );
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="/" className="nav-logo">
        <img
          src="/images/logo/siaga-full.png"
          alt="SIAGA"
          className="nav-logo-img"
        />
      </a>

      <ul className="nav-links">
        <li><a href="#fitur" className="nav-link">Fitur</a></li>
        <li><a href="#cara-kerja" className="nav-link">Cara Kerja</a></li>
        <li><a href="#sektor" className="nav-link">Sektor</a></li>
        <li><a href="#testimoni" className="nav-link">Testimoni</a></li>
      </ul>

      <div className="nav-actions">
        <a href="#login" className="btn btn-ghost">Masuk</a>
        <a href="#register" className="btn btn-nav-primary">
          Coba Gratis
          <span className="btn-nav-arrow">→</span>
        </a>
      </div>
    </nav>
  );
}
