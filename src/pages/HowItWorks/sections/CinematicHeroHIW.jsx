import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, getRegisterPath } from '../../../routes/appRoutes';
import './CinematicHeroHIW.css';

const trustChips = [
 '4 Langkah Kerja',
 'Pilot Terverifikasi',
 'Escrow Aman',
 'PDF Report Otomatis',
];

// Real project images for background slideshow
const heroSlides = [
 '/images/projects/sutet_bandung-cover-compressed.jpg',
 '/images/projects/barelang-cover-compressed.jpg',
 '/images/projects/bendungan_gajahmungkur-cover-compressed.jpg',
 '/images/projects/tol_semarangsolo-cover-compressed.jpg',
 '/images/projects/tower_surakarta-cover-compressed.jpg',
];

export default function CinematicHeroHIW() {
 const heroRef = useRef(null);
 const [currentSlide, setCurrentSlide] = useState(0);

 useEffect(() => {
 const el = heroRef.current;
 if (!el) return;
 requestAnimationFrame(() => el.classList.add('mch--visible'));
 }, []);

 // Auto-slide every 5 seconds
 useEffect(() => {
 const interval = setInterval(() => {
 setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
 }, 5000);
 return () => clearInterval(interval);
 }, []);

 return (
 <section className="mch" ref={heroRef}>
 {/* Background slideshow */}
 <div className="mch__slideshow" aria-hidden="true">
 {heroSlides.map((src, i) => (
 <div
 key={src}
 className={`mch__slide ${i === currentSlide ? 'mch__slide--active' : ''}`}
 style={{ backgroundImage: `url(${src})` }}
 />
 ))}
 </div>

 {/* Blue sky overlay */}
 <div className="mch__overlay" aria-hidden="true" />

 {/* Grid pattern */}
 <div className="mch__bg" aria-hidden="true">
 <div className="mch__grid" />
 <div className="mch__orb mch__orb--1" />
 <div className="mch__orb mch__orb--2" />
 </div>

 <div className="mch__container">
 {/* Left: Content */}
 <div className="mch__content">
 <nav className="mch__breadcrumb" aria-label="Breadcrumb">
 <Link to={ROUTES.home} className="mch__breadcrumb-link">Home</Link>
 <span className="mch__breadcrumb-sep" aria-hidden="true">/</span>
 <span className="mch__breadcrumb-current">How It Works</span>
 </nav>

 <span className="mch__badge">SIAGA WORKFLOW</span>

 <h1 className="mch__title">
 Dari Proyek Infrastruktur ke{' '}
 <span className="mch__title-accent">Laporan Inspeksi Profesional</span>
 </h1>

 <p className="mch__subtitle">
 Posting kebutuhan inspeksi, temukan pilot UAV tersertifikasi, pantau progres lapangan, dan dapatkan laporan PDF siap pakai dalam satu workflow.
 </p>

 <div className="mch__ctas">
 <Link to={getRegisterPath('client')} className="mch__cta mch__cta--primary">
 Mulai sebagai Client
 </Link>
 <Link to={getRegisterPath('pilot')} className="mch__cta mch__cta--secondary">
 Gabung sebagai Pilot
 </Link>
 </div>

 <div className="mch__chips">
 {trustChips.map((chip) => (
 <span key={chip} className="mch__chip">{chip}</span>
 ))}
 </div>
 </div>

 {/* Right: Mission Control Preview */}
 <div className="mch__preview" aria-hidden="true">
 <div className="mch__preview-card">
 {/* Header */}
 <div className="mch__preview-header">
 <div className="mch__preview-dots">
 <span /><span /><span />
 </div>
 <span className="mch__preview-title">Mission Control</span>
 </div>

 {/* Body */}
 <div className="mch__preview-body">
 {/* Project info */}
 <div className="mch__preview-project">
 <div className="mch__preview-project-name">Inspeksi Tower SUTET #47</div>
 <div className="mch__preview-project-loc">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
 Bandung, Jawa Barat
 </div>
 <div className="mch__preview-status">
 <span className="mch__preview-status-dot" />
 Pilot Matching
 </div>
 </div>

 {/* Progress */}
 <div className="mch__preview-progress">
 <div className="mch__preview-progress-header">
 <span>Progress</span>
 <span className="mch__preview-progress-pct">65%</span>
 </div>
 <div className="mch__preview-progress-bar">
 <div className="mch__preview-progress-fill" />
 </div>
 </div>

 {/* Mini map */}
 <div className="mch__preview-map">
 <div className="mch__preview-map-grid" />
 <svg className="mch__preview-map-route" viewBox="0 0 180 80" fill="none">
 <path d="M15 65 C40 20, 80 50, 110 25 C140 0, 165 40, 165 65" stroke="rgba(0,212,255,0.6)" strokeWidth="2" strokeDasharray="4 3" fill="none"/>
 <circle cx="15" cy="65" r="4" fill="#00D4FF"/>
 <circle cx="110" cy="25" r="3" fill="#2196F3"/>
 <circle cx="165" cy="65" r="4" fill="#00D4FF"/>
 </svg>
 <div className="mch__preview-map-pin" />
 </div>

 {/* Pilot card */}
 <div className="mch__preview-pilot">
 <div className="mch__preview-pilot-avatar">RP</div>
 <div className="mch__preview-pilot-info">
 <span className="mch__preview-pilot-name">Rizal Pratama</span>
 <span className="mch__preview-pilot-spec">SUTET & Tower</span>
 </div>
 <div className="mch__preview-pilot-badge">
 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
 Verified
 </div>
 </div>

 {/* Telemetry */}
 <div className="mch__preview-telemetry">
 <div className="mch__preview-tele-item">
 <span className="mch__preview-tele-val">127m</span>
 <span className="mch__preview-tele-label">Altitude</span>
 </div>
 <div className="mch__preview-tele-item">
 <span className="mch__preview-tele-val">98%</span>
 <span className="mch__preview-tele-label">Battery</span>
 </div>
 <div className="mch__preview-tele-item">
 <span className="mch__preview-tele-val">4.2km</span>
 <span className="mch__preview-tele-label">Coverage</span>
 </div>
 <div className="mch__preview-tele-item mch__preview-tele-item--alert">
 <span className="mch__preview-tele-val">3</span>
 <span className="mch__preview-tele-label">Defects</span>
 </div>
 </div>

 {/* Report status */}
 <div className="mch__preview-report">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
 <span>Draft report generated</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Slide indicators */}
 <div className="mch__indicators" aria-hidden="true">
 {heroSlides.map((_, i) => (
 <button
 key={i}
 type="button"
 className={`mch__indicator ${i === currentSlide ? 'mch__indicator--active' : ''}`}
 onClick={() => setCurrentSlide(i)}
 aria-label={`Slide ${i + 1}`}
 />
 ))}
 </div>
 </section>
 );
}
