import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
 FileText,
 MapPin,
 Shield,
 Activity,
 Camera,
 BarChart3,
 Download,
 CheckCircle2,
 Clock,
 Star,
 Zap,
 ArrowRight,
} from 'lucide-react';
import './HowItWorks.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── Steps Data ─── */
const stepsData = [
 {
 id: 1,
 label: 'POST PROJECT',
 title: 'Posting Proyek',
 highlight: 'Inspeksi Anda',
 desc: 'Cukup isi detail proyek, pilih lokasi di peta, dan tentukan jadwal. Sistem kami langsung mencocokkan dengan pilot terbaik di area tersebut.',
 windowTitle: 'New Inspection Project',
 features: [
 { icon: FileText, text: 'Form cerdas — isi dalam 2 menit' },
 { icon: MapPin, text: 'Pilih lokasi langsung di peta interaktif' },
 { icon: Clock, text: 'Jadwal fleksibel, mulai dari H+1' },
 ],
 },
 {
 id: 2,
 label: 'SELECT PILOT',
 title: 'Pilih Pilot',
 highlight: 'Tersertifikasi',
 desc: 'Algoritma matching otomatis menyajikan pilot terbaik berdasarkan lokasi, rating, dan spesialisasi. Semua terverifikasi SIAGA.',
 windowTitle: 'Pilot Matching',
 features: [
 { icon: Shield, text: 'Semua pilot terverifikasi & bersertifikat' },
 { icon: Star, text: 'Rating transparan dari klien sebelumnya' },
 { icon: Zap, text: 'Auto-match dalam hitungan detik' },
 ],
 },
 {
 id: 3,
 label: 'MONITOR',
 title: 'Pantau',
 highlight: 'Real-Time',
 desc: 'Lihat progress inspeksi secara langsung dari dashboard. Foto terupload otomatis, status terupdate, semua dalam satu layar.',
 windowTitle: 'Live Mission Dashboard',
 features: [
 { icon: Activity, text: 'Live tracking posisi drone' },
 { icon: Camera, text: 'Foto & video terupload real-time' },
 { icon: BarChart3, text: 'Progress bar & estimasi selesai' },
 ],
 },
 {
 id: 4,
 label: 'REPORT',
 title: 'Laporan Instan',
 highlight: 'Satu Klik',
 desc: 'Dari 2 bulan menjadi 30 detik. Laporan inspeksi profesional berstandar internasional, siap download dan presentasi.',
 windowTitle: 'Auto Report Generator',
 features: [
 { icon: Download, text: 'PDF profesional auto-generated' },
 { icon: CheckCircle2, text: 'Standar internasional, siap audit' },
 { icon: BarChart3, text: 'Data terstruktur & bisa dibandingkan' },
 ],
 },
];

/* ─── Pilot Cards Data ─── */
const pilots = [
 { name: 'Andi Pratama', rating: 4.9, missions: 127, speciality: 'SUTET & Tower', verified: true },
 { name: 'Rizal Hidayat', rating: 4.95, missions: 203, speciality: 'Migas & Offshore', verified: true, featured: true },
 { name: 'Fajar Nugroho', rating: 4.8, missions: 89, speciality: 'Konstruksi', verified: true },
];

/* ─── Interactive Demo Card Wrapper ─── */
function DemoCard({ windowTitle, children }) {
 const cardRef = useRef(null);

 const handleMouseMove = useCallback((e) => {
 const card = cardRef.current;
 if (!card) return;
 const rect = card.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 const rotateY = ((x / rect.width) - 0.5) * 5;
 const rotateX = -((y / rect.height) - 0.5) * 3;

 card.style.setProperty('--mouse-x', `${x}px`);
 card.style.setProperty('--mouse-y', `${y}px`);
 card.style.setProperty('--rotate-x', `${rotateX}deg`);
 card.style.setProperty('--rotate-y', `${rotateY}deg`);
 }, []);

 const handleMouseLeave = useCallback(() => {
 const card = cardRef.current;
 if (!card) return;
 card.style.setProperty('--rotate-x', '0deg');
 card.style.setProperty('--rotate-y', '0deg');
 }, []);

 return (
 <div
 ref={cardRef}
 className="demo-card"
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
 >
 {/* Spotlight overlay */}
 <div className="demo-card__spotlight" />
 {/* Shine sweep */}
 <div className="demo-card__shine" />
 {/* Window frame */}
 <div className="demo-card__window">
 <div className="demo-card__header">
 <div className="demo-card__dots">
 <span /><span /><span />
 </div>
 <span className="demo-card__title">{windowTitle}</span>
 <div className="demo-card__header-spacer" />
 </div>
 <div className="demo-card__body">
 {children}
 </div>
 </div>
 </div>
 );
}

/* ─── Step 1: Post Project Visual ─── */
function StepOneVisual() {
 return (
 <DemoCard windowTitle="New Inspection Project">
 <div className="hiw-form-body">
 <div className="hiw-form-field hiw-field-active">
 <label>Nama Proyek</label>
 <div className="hiw-field-input">
 <span className="hiw-field-text">Inspeksi Tower SUTET #47 — Jawa Barat</span>
 <span className="hiw-field-cursor" />
 </div>
 </div>
 <div className="hiw-form-field">
 <label>Tipe Infrastruktur</label>
 <div className="hiw-field-select">
 <span>Transmisi Listrik</span>
 <Zap size={14} />
 </div>
 </div>
 <div className="hiw-form-row">
 <div className="hiw-form-field">
 <label>Tanggal Mulai</label>
 <div className="hiw-field-input"><span className="hiw-field-text">15 Jan 2026</span></div>
 </div>
 <div className="hiw-form-field">
 <label>Durasi</label>
 <div className="hiw-field-input"><span className="hiw-field-text">2 Hari</span></div>
 </div>
 </div>
 <div className="hiw-form-map">
 <div className="hiw-map-placeholder">
 <MapPin size={20} />
 <span>Bandung, Jawa Barat</span>
 </div>
 <div className="hiw-map-pin-pulse" />
 </div>
 <button className="hiw-form-submit" type="button">
 <span>Publish Project</span>
 <ArrowRight size={16} />
 </button>
 </div>
 </DemoCard>
 );
}

/* ─── Step 2: Select Pilot Visual ─── */
function StepTwoVisual() {
 return (
 <DemoCard windowTitle="Pilot Matching">
 <div className="hiw-pilots-grid">
 {pilots.map((pilot, i) => (
 <div key={i} className={`hiw-pilot-card ${pilot.featured ? 'hiw-pilot-featured' : ''}`}>
 {pilot.featured && <div className="hiw-pilot-badge-best">BEST MATCH</div>}
 <div className="hiw-pilot-avatar">
 <span>{pilot.name.split(' ').map(n => n[0]).join('')}</span>
 </div>
 <div className="hiw-pilot-info">
 <h4>{pilot.name}</h4>
 <p className="hiw-pilot-spec">{pilot.speciality}</p>
 <div className="hiw-pilot-stats">
 <span className="hiw-pilot-rating">
 <Star size={12} fill="currentColor" /> {pilot.rating}
 </span>
 <span className="hiw-pilot-missions">{pilot.missions} misi</span>
 </div>
 </div>
 {pilot.verified && (
 <div className="hiw-pilot-verified">
 <Shield size={13} />
 <span>SIAGA Verified</span>
 </div>
 )}
 </div>
 ))}
 </div>
 </DemoCard>
 );
}

/* ─── Step 3: Monitor Visual ─── */
function StepThreeVisual() {
 return (
 <DemoCard windowTitle="Live Mission Dashboard">
 <div className="hiw-dash-body">
 <div className="hiw-dash-header-inline">
 <div className="hiw-dash-status">
 <span className="hiw-dash-dot-live" />
 <span>LIVE — Inspeksi Berlangsung</span>
 </div>
 <span className="hiw-dash-time">14:32:07</span>
 </div>
 <div className="hiw-dash-progress">
 <div className="hiw-dash-progress-header">
 <span>Foto Terupload</span>
 <span className="hiw-dash-progress-count">47 / 120</span>
 </div>
 <div className="hiw-dash-progress-bar">
 <div className="hiw-dash-progress-fill" />
 </div>
 </div>
 <div className="hiw-dash-metrics">
 <div className="hiw-dash-metric">
 <span className="hiw-dash-metric-value">4.2 km</span>
 <span className="hiw-dash-metric-label">Area Covered</span>
 </div>
 <div className="hiw-dash-metric">
 <span className="hiw-dash-metric-value">127m</span>
 <span className="hiw-dash-metric-label">Altitude</span>
 </div>
 <div className="hiw-dash-metric">
 <span className="hiw-dash-metric-value">98%</span>
 <span className="hiw-dash-metric-label">Battery</span>
 </div>
 </div>
 <div className="hiw-dash-feed">
 <div className="hiw-dash-feed-item">
 <CheckCircle2 size={14} />
 <span>Tower #47-A inspeksi selesai</span>
 <span className="hiw-dash-feed-time">2m ago</span>
 </div>
 <div className="hiw-dash-feed-item hiw-feed-active">
 <Activity size={14} />
 <span>Tower #47-B sedang diinspeksi...</span>
 <span className="hiw-dash-feed-time">now</span>
 </div>
 </div>
 </div>
 </DemoCard>
 );
}

/* ─── Step 4: Report Visual ─── */
function StepFourVisual() {
 return (
 <DemoCard windowTitle="Auto Report Generator">
 <div className="hiw-report-scene">
 <div className="hiw-report-btn-wrapper">
 <button className="hiw-report-generate-btn" type="button">
 <Download size={18} />
 <span>Generate Report</span>
 </button>
 <div className="hiw-report-btn-glow" />
 </div>
 <div className="hiw-report-progress-wrapper">
 <div className="hiw-report-progress-bar">
 <div className="hiw-report-progress-fill" />
 </div>
 <span className="hiw-report-progress-text">Generating...</span>
 </div>
 <div className="hiw-report-card">
 <div className="hiw-report-card-header">
 <div className="hiw-report-icon">
 <FileText size={24} />
 </div>
 <div>
 <h4>Inspection Report</h4>
 <p>Tower SUTET #47 — Jawa Barat</p>
 </div>
 </div>
 <div className="hiw-report-card-meta">
 <span className="hiw-report-tag">PDF</span>
 <span className="hiw-report-size">12.4 MB</span>
 <span className="hiw-report-pages">47 Pages</span>
 </div>
 <div className="hiw-report-card-preview">
 <div className="hiw-report-line" />
 <div className="hiw-report-line hiw-report-line-short" />
 <div className="hiw-report-line" />
 <div className="hiw-report-line hiw-report-line-med" />
 </div>
 <div className="hiw-report-ready">
 <CheckCircle2 size={16} />
 <span>Ready to Download</span>
 </div>
 </div>
 </div>
 <div className="hiw-report-impact">
 <span className="hiw-impact-from">Dari 2 bulan</span>
 <span className="hiw-impact-arrow">→</span>
 <span className="hiw-impact-to">30 detik.</span>
 </div>
 </DemoCard>
 );
}

/* ─── Single Step Row ─── */
function StepRow({ step, index, visual }) {
 const isEven = index % 2 === 0;

 return (
 <div className={`hiw-step-row ${isEven ? '' : 'hiw-step-row-reverse'}`} data-step={step.id}>
 {/* Text Side */}
 <div className="hiw-step-text">
 <div className="hiw-step-number">
 <span>0{step.id}</span>
 </div>
 <div className="hiw-step-label-tag">{step.label}</div>
 <h3 className="hiw-step-title">
 {step.title}{' '}
 <span className="hiw-step-highlight">{step.highlight}</span>
 </h3>
 <p className="hiw-step-desc">{step.desc}</p>
 <ul className="hiw-step-features">
 {step.features.map((feat, fi) => (
 <li key={fi} className="hiw-feature-item">
 <div className="hiw-feature-icon">
 <feat.icon size={16} />
 </div>
 <span>{feat.text}</span>
 </li>
 ))}
 </ul>
 </div>

 {/* Visual Side */}
 <div className="hiw-step-visual">
 {visual}
 </div>
 </div>
 );
}

/* ─── Main Component ─── */
function HowItWorks() {
 const sectionRef = useRef(null);

 useEffect(() => {
 const section = sectionRef.current;
 if (!section) return;

 const ctx = gsap.context(() => {
 // Header entrance
 gsap.fromTo(
 '.hiw-label',
 { y: 20, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.hiw-header', start: 'top 85%' } }
 );
 gsap.fromTo(
 '.hiw-heading',
 { y: 30, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.hiw-header', start: 'top 80%' } }
 );
 gsap.fromTo(
 '.hiw-subheading',
 { y: 20, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.hiw-header', start: 'top 75%' } }
 );

 // Each step row animates in
 const stepRows = section.querySelectorAll('.hiw-step-row');
 stepRows.forEach((row) => {
 const textEl = row.querySelector('.hiw-step-text');
 const visualEl = row.querySelector('.hiw-step-visual');

 gsap.fromTo(textEl,
 { x: -60, opacity: 0 },
 {
 x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
 scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none reverse' },
 }
 );

 gsap.fromTo(visualEl,
 { y: 40, opacity: 0 },
 {
 y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
 scrollTrigger: { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' },
 }
 );
 });

 // Connector lines grow
 const connectors = section.querySelectorAll('.hiw-connector');
 connectors.forEach((conn) => {
 gsap.fromTo(conn,
 { scaleY: 0 },
 {
 scaleY: 1, duration: 0.8, ease: 'power2.out',
 scrollTrigger: { trigger: conn, start: 'top 85%', toggleActions: 'play none none reverse' },
 }
 );
 });

 }, section);

 return () => ctx.revert();
 }, []);

 const visuals = [
 <StepOneVisual key="v1" />,
 <StepTwoVisual key="v2" />,
 <StepThreeVisual key="v3" />,
 <StepFourVisual key="v4" />,
 ];

 return (
 <section className="hiw-section" ref={sectionRef} id="how-it-works">
 {/* Background */}
 <div className="hiw-bg" aria-hidden="true">
 <div className="hiw-bg-base" />
 <div className="hiw-bg-grid" />
 <div className="hiw-bg-orb hiw-bg-orb-1" />
 <div className="hiw-bg-orb hiw-bg-orb-2" />
 </div>

 {/* Header */}
 <header className="hiw-header">
 <span className="hiw-label">[ HOW IT WORKS ]</span>
 <h2 className="hiw-heading">
 Empat Langkah.<br />
 <span className="hiw-heading-accent">Tanpa Ribet.</span>
 </h2>
 <p className="hiw-subheading">
 Dari posting proyek hingga laporan profesional di tangan Anda —
 semua berjalan otomatis dalam satu platform.
 </p>
 </header>

 {/* Steps */}
 <div className="hiw-steps-container">
 {stepsData.map((step, i) => (
 <div key={step.id} className="hiw-step-wrapper">
 <StepRow step={step} index={i} visual={visuals[i]} />
 {i < stepsData.length - 1 && (
 <div className="hiw-connector">
 <div className="hiw-connector-line" />
 <div className="hiw-connector-dot" />
 </div>
 )}
 </div>
 ))}
 </div>
 </section>
 );
}

export default HowItWorks;
