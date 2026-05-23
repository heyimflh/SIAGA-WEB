import { useEffect, useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Camera, Crosshair, Radio, BatteryFull } from 'lucide-react';
import './HeroMobileTablet.css';

const SceneMobile = lazy(() => import('./SceneMobile'));

const stats = [
 {
 icon: Camera,
 value: '45MP',
 label: 'Full-Frame',
 },
 {
 icon: Crosshair,
 value: '±1cm',
 label: 'RTK Akurasi',
 },
 {
 icon: Radio,
 value: '15KM',
 label: 'Jangkauan',
 },
 {
 icon: BatteryFull,
 value: '55 Min',
 label: 'Waktu Terbang',
 },
];

export default function HeroMobileTablet() {
 const sectionRef = useRef(null);

 useEffect(() => {
 const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (prefersReduced) return;

 const ctx = gsap.context(() => {
 const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

 tl.fromTo(
 '.hmt-eyebrow',
 { y: 16, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.5 },
 0.2
 );

 tl.fromTo(
 '.hmt-title .hmt-line',
 { y: 24, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
 0.3
 );

 tl.fromTo(
 '.hmt-subtitle',
 { y: 16, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.5 },
 0.7
 );

 tl.fromTo(
 '.hmt-cta-group .hmt-btn',
 { y: 16, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
 0.85
 );

 tl.fromTo(
 '.hmt-stage',
 { y: 30, opacity: 0, scale: 0.96 },
 { y: 0, opacity: 1, scale: 1, duration: 0.7 },
 1.0
 );

 tl.fromTo(
 '.hmt-stat-card',
 { y: 16, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
 1.3
 );
 }, sectionRef);

 return () => ctx.revert();
 }, []);

 return (
 <section className="hmt-hero" ref={sectionRef} aria-label="Hero">
 <div className="hmt-bg" aria-hidden="true">
 <div className="hmt-bg-grid" />
 <div className="hmt-bg-glow hmt-bg-glow--1" />
 <div className="hmt-bg-glow hmt-bg-glow--2" />
 </div>

 <div className="hmt-container">

 <p className="hmt-eyebrow">
 <span className="hmt-eyebrow-dot" />
 Platform Inspeksi Drone #1 Indonesia
 </p>


 <h1 className="hmt-title">
 <span className="hmt-line">Infrastruktur Anda</span>
 <span className="hmt-line">Selalu dalam</span>
 <span className="hmt-line">
 <span className="hmt-highlight">Pengawasan.</span>
 </span>
 </h1>

 <p className="hmt-subtitle">
 Marketplace B2B inspeksi aerial untuk infrastruktur kritis — menara
 SUTET, jembatan, dan kilang minyak.
 </p>


 <div className="hmt-cta-group">
 <Link to="/register?role=client" className="hmt-btn hmt-btn--primary">
 <span>Hire a Pilot</span>
 <ArrowRight size={18} strokeWidth={2.5} />
 </Link>
 <Link to="/register?role=pilot" className="hmt-btn hmt-btn--secondary">
 Bergabung sebagai Pilot
 </Link>
 </div>

 <div className="hmt-stage" aria-label="Interactive drone visualization">
 <div className="hmt-stage-grid" aria-hidden="true" />
 <div className="hmt-stage-glow" aria-hidden="true" />
 <div className="hmt-stage-canvas">
 <Suspense
 fallback={<div className="hmt-stage-fallback" />}
 >
 <SceneMobile />
 </Suspense>
 </div>
 <div className="hmt-stage-tag" aria-hidden="true">
 <span className="hmt-stage-tag-dot" />
 DRONE INTERAKTIF
 </div>
 </div>

 <div className="hmt-stats">
 {stats.map((s) => {
 const Icon = s.icon;
 return (
 <div className="hmt-stat-card" key={s.label}>
 <div className="hmt-stat-icon">
 <Icon size={16} strokeWidth={2} />
 </div>
 <div className="hmt-stat-text">
 <span className="hmt-stat-value">{s.value}</span>
 <span className="hmt-stat-label">{s.label}</span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </section>
 );
}
