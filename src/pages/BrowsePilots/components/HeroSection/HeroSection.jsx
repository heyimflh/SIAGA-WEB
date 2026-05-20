import { useState, useEffect, useRef } from 'react';
import { Search, Shield, MapPin, Briefcase, Clock, Award } from 'lucide-react';
import './HeroSection.css';

const HERO_IMAGES = [
  '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
  '/images/services-categories/Jembatan___Jalan_Tol_300kb.jpg',
  '/images/services-categories/Bendungan___Irigasi_300kb.jpg',
  '/images/services-categories/Konstruksi_Tinggi___Crane_300kb.jpg',
  '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
  '/images/services-categories/Solar_Panel_Farm_300kb.jpg',
];

const TRUST_METRICS = [
  { icon: Shield, value: '500+', label: 'Pilot UAV' },
  { icon: MapPin, value: '34', label: 'Provinsi' },
  { icon: Briefcase, value: '1.200+', label: 'Proyek Inspeksi' },
  { icon: Clock, value: '98%', label: 'Response Rate' },
  { icon: Award, value: 'SIDOPI', label: 'Verified Network' },
];

export default function HeroSection({
  searchQuery, onSearchChange, suggestions, showSuggestions,
  suggestionIndex, onSuggestionSelect, onKeyDown, onFocus, onBlur,
}) {
  const listboxId = 'pilots-search-listbox';
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="pilots-hero">
      {/* Sliding background images */}
      <div className="pilots-hero__slideshow" aria-hidden="true">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`pilots-hero__slide ${i === currentSlide ? 'pilots-hero__slide--active' : ''}`}
          >
            <img src={src} alt="" className="pilots-hero__slide-img" />
          </div>
        ))}
      </div>

      {/* Blue-sky overlay layers */}
      <div className="pilots-hero__overlay" aria-hidden="true" />
      <div className="pilots-hero__bg-pattern" aria-hidden="true" />
      <div className="pilots-hero__glow" aria-hidden="true" />

      {/* Floating glass badges */}
      <div className="pilots-hero__floating" aria-hidden="true">
        <span className="pilots-hero__float-badge pilots-hero__float-badge--1">SIDOPI Verified</span>
        <span className="pilots-hero__float-badge pilots-hero__float-badge--2">DJI M300 RTK</span>
        <span className="pilots-hero__float-badge pilots-hero__float-badge--3">Thermal Expert</span>
        <span className="pilots-hero__float-badge pilots-hero__float-badge--4">Infrastructure</span>
      </div>

      {/* Slide indicators */}
      <div className="pilots-hero__indicators" aria-hidden="true">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`pilots-hero__indicator ${i === currentSlide ? 'pilots-hero__indicator--active' : ''}`}
            onClick={() => setCurrentSlide(i)}
            tabIndex={-1}
          />
        ))}
      </div>

      <div className="pilots-hero__content">
        <span className="pilots-hero__badge">SIAGA PILOT NETWORK</span>

        <h1 className="pilots-hero__heading">
          Temukan <span className="pilots-hero__heading-accent">Pilot UAV</span> Tersertifikasi
          untuk <span className="pilots-hero__heading-accent">Inspeksi Infrastruktur</span>
        </h1>

        <p className="pilots-hero__subtitle">
          Jelajahi jaringan pilot drone profesional SIAGA untuk inspeksi
          jembatan, SUTET, bendungan, jalan tol, tower, dan aset strategis lainnya.
        </p>

        {/* Search Bar */}
        <div className="pilots-hero__search-wrapper">
          <div className="pilots-search" role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-haspopup="listbox" aria-owns={listboxId}>
            <Search className="pilots-search__icon" size={20} />
            <input
              type="text"
              className="pilots-search__input"
              placeholder="Cari: SUTET, Bandung, Thermal, DJI M300..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              aria-label="Cari pilot berdasarkan nama, lokasi, atau spesialisasi"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                suggestionIndex >= 0 ? `suggestion-${suggestionIndex}` : undefined
              }
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul id={listboxId} className="pilots-search__suggestions" role="listbox">
              {suggestions.map((s, i) => (
                <li
                  key={`${s.type}-${s.text}`}
                  id={`suggestion-${i}`}
                  role="option"
                  aria-selected={i === suggestionIndex}
                  className={`pilots-search__suggestion ${i === suggestionIndex ? 'pilots-search__suggestion--active' : ''}`}
                  onMouseDown={() => onSuggestionSelect(s)}
                >
                  <span className="pilots-search__suggestion-type">{s.type}</span>
                  <span className="pilots-search__suggestion-text">{s.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Trust Metrics */}
        <div className="pilots-hero__metrics">
          {TRUST_METRICS.map((m) => (
            <div key={m.label} className="pilots-hero__metric">
              <m.icon size={18} className="pilots-hero__metric-icon" />
              <div className="pilots-hero__metric-text">
                <span className="pilots-hero__metric-value">{m.value}</span>
                <span className="pilots-hero__metric-label">{m.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
