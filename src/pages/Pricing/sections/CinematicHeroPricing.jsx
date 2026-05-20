import { useEffect, useRef, useState } from 'react';
import './CinematicHeroPricing.css';

const trustChips = [
  '7% Platform Fee',
  '93% untuk Pilot',
  'Escrow Protected',
  'No Hidden Fees',
];

// Real project images for background slideshow
const heroSlides = [
  '/images/projects/bendungan_gajahmungkur-cover-compressed.jpg',
  '/images/projects/tol_semarangsolo-cover-compressed.jpg',
  '/images/projects/sutet_bandung-cover-compressed.jpg',
  '/images/projects/barelang-cover-compressed.jpg',
  '/images/projects/tower_surakarta-cover-compressed.jpg',
];

export default function CinematicHeroPricing() {
  const heroRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add('ph--visible'));
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="ph" ref={heroRef}>
      {/* Background slideshow */}
      <div className="ph__slideshow" aria-hidden="true">
        {heroSlides.map((src, i) => (
          <div
            key={src}
            className={`ph__slide ${i === currentSlide ? 'ph__slide--active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* Blue sky overlay */}
      <div className="ph__overlay" aria-hidden="true" />

      <div className="ph__bg" aria-hidden="true">
        <div className="ph__grid" />
        <div className="ph__orb ph__orb--1" />
        <div className="ph__orb ph__orb--2" />
      </div>

      <div className="ph__container">
        <div className="ph__content">
          <span className="ph__badge">TRANSPARENT PRICING</span>

          <h1 className="ph__title">
            Harga Transparan untuk{' '}
            <span className="ph__title-accent">Inspeksi Infrastruktur Profesional</span>
          </h1>

          <p className="ph__subtitle">
            Mulai gratis, pilih paket sesuai skala proyek, dan gunakan sistem escrow SIAGA untuk menjaga pembayaran tetap aman hingga laporan inspeksi selesai.
          </p>

          <div className="ph__ctas">
            <a href="#pricing-tiers" className="ph__cta ph__cta--primary" onClick={scrollTo('pricing-tiers')}>
              Lihat Paket Harga
            </a>
            <a href="#escrow-flow" className="ph__cta ph__cta--secondary" onClick={scrollTo('escrow-flow')}>
              Pelajari Escrow
            </a>
          </div>

          <div className="ph__chips">
            {trustChips.map((chip) => (
              <span key={chip} className="ph__chip">{chip}</span>
            ))}
          </div>
        </div>

        {/* Pricing Console Preview */}
        <div className="ph__preview" aria-hidden="true">
          <div className="ph__console">
            <div className="ph__console-header">
              <div className="ph__console-dots"><span/><span/><span/></div>
              <span className="ph__console-title">Pricing Console</span>
            </div>
            <div className="ph__console-body">
              <div className="ph__console-row">
                <span className="ph__console-label">Project Value</span>
                <span className="ph__console-value">Rp 15.000.000</span>
              </div>
              <div className="ph__console-row">
                <span className="ph__console-label">Selected Plan</span>
                <span className="ph__console-value ph__console-value--cyan">Professional</span>
              </div>
              <div className="ph__console-row">
                <span className="ph__console-label">Report Output</span>
                <span className="ph__console-value">PDF + Dashboard</span>
              </div>

              <div className="ph__console-escrow">
                <div className="ph__console-escrow-icon">🔒</div>
                <div className="ph__console-escrow-info">
                  <span className="ph__console-escrow-status">Escrow Protected</span>
                  <span className="ph__console-escrow-text">Dana ditahan hingga inspeksi selesai</span>
                </div>
              </div>

              <div className="ph__console-split">
                <div className="ph__console-split-header">Payment Split</div>
                <div className="ph__console-split-bar">
                  <div className="ph__console-split-platform">7%</div>
                  <div className="ph__console-split-pilot">93%</div>
                </div>
                <div className="ph__console-split-labels">
                  <span>Platform Fee</span>
                  <span>Pilot Settlement</span>
                </div>
              </div>

              <div className="ph__console-timeline">
                <div className="ph__console-tl-step ph__console-tl-step--done">
                  <span className="ph__console-tl-dot"/>
                  <span>Client Payment</span>
                </div>
                <div className="ph__console-tl-step ph__console-tl-step--active">
                  <span className="ph__console-tl-dot"/>
                  <span>SIAGA Escrow</span>
                </div>
                <div className="ph__console-tl-step">
                  <span className="ph__console-tl-dot"/>
                  <span>Inspection Complete</span>
                </div>
                <div className="ph__console-tl-step">
                  <span className="ph__console-tl-dot"/>
                  <span>Pilot Settlement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="ph__indicators" aria-hidden="true">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`ph__indicator ${i === currentSlide ? 'ph__indicator--active' : ''}`}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
