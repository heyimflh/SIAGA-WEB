import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
 Building2,
 Plane,
 CheckCircle2,
 ArrowRight,
 ArrowLeftRight,
} from 'lucide-react';
import { getRegisterPath } from '../../routes/appRoutes';
import './DualAudience.css';

gsap.registerPlugin(ScrollTrigger);

const enterpriseBullets = [
 'Akses 500+ pilot bersertifikat',
 'Bidding kompetitif dan transparan',
 'Escrow payment sampai pekerjaan selesai',
 'Laporan PDF profesional sekali klik',
];

const pilotBullets = [
 'Akses proyek BUMN dan enterprise',
 'Pembayaran dijamin via escrow',
 'Bangun portofolio inspeksi industri',
 'Komisi platform hanya 7%',
];

function AnimatedStat({ end, suffix = '', duration = 2000 }) {
 const ref = useRef(null);
 const hasAnimated = useRef(false);

 useEffect(() => {
 const el = ref.current;
 if (!el) return;

 const observer = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting && !hasAnimated.current) {
 hasAnimated.current = true;
 const startTime = performance.now();
 function animate(now) {
 const elapsed = now - startTime;
 const progress = Math.min(elapsed / duration, 1);
 const eased = 1 - Math.pow(2, -10 * progress);
 const current = Math.round(eased * end);
 el.textContent = current + suffix;
 if (progress < 1) requestAnimationFrame(animate);
 }
 requestAnimationFrame(animate);
 }
 });
 },
 { threshold: 0.3 }
 );
 observer.observe(el);
 return () => observer.disconnect();
 }, [end, suffix, duration]);

 return <span ref={ref}>0{suffix}</span>;
}

function DualAudience() {
 const sectionRef = useRef(null);
 const headlineRef = useRef(null);
 const subheadRef = useRef(null);
 const leftPanelRef = useRef(null);
 const rightPanelRef = useRef(null);
 const centerNodeRef = useRef(null);
 const leftBulletsRef = useRef([]);
 const rightBulletsRef = useRef([]);

 useEffect(() => {
 const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (prefersReduced) return;

 const ctx = gsap.context(() => {
 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: sectionRef.current,
 start: 'top 75%',
 end: 'top 30%',
 toggleActions: 'play none none reverse',
 },
 });


 tl.fromTo(
 headlineRef.current,
 { y: 30, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
 );

 tl.fromTo(
 subheadRef.current,
 { y: 20, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
 '-=0.4'
 );


 tl.fromTo(
 leftPanelRef.current,
 { x: -40, opacity: 0 },
 { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
 '-=0.3'
 );

 tl.fromTo(
 rightPanelRef.current,
 { x: 40, opacity: 0 },
 { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
 '-=0.7'
 );


 tl.fromTo(
 centerNodeRef.current,
 { scale: 0, opacity: 0 },
 {
 scale: 1,
 opacity: 1,
 duration: 0.6,
 ease: 'back.out(1.7)',
 },
 '-=0.5'
 );


 const leftBullets = leftBulletsRef.current.filter(Boolean);
 if (leftBullets.length) {
 tl.fromTo(
 leftBullets,
 { y: 15, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
 '-=0.3'
 );
 }


 const rightBullets = rightBulletsRef.current.filter(Boolean);
 if (rightBullets.length) {
 tl.fromTo(
 rightBullets,
 { y: 15, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
 '-=0.6'
 );
 }
 }, sectionRef);

 return () => ctx.revert();
 }, []);

 return (
 <section className="da-section" id="fitur" ref={sectionRef}>

 <div className="da-bg" aria-hidden="true">
 <div className="da-bg-grid" />
 </div>

 <div className="da-container">

 <div className="da-header">
 <h2 className="da-headline" ref={headlineRef}>
 Satu Platform, Dua Sisi Infrastruktur
 </h2>
 <p className="da-subheadline" ref={subheadRef}>
 Perusahaan mendapatkan pilot inspeksi terbaik. Pilot bersertifikat
 mendapatkan proyek korporat yang layak — semua dalam satu marketplace
 yang aman, cepat, dan terukur.
 </p>
 </div>

 <div className="da-panels">
 <div className="da-panel da-panel--left" ref={leftPanelRef}>
 <div className="da-panel-inner">
 <div className="da-panel-icon">
 <Building2 size={28} strokeWidth={1.5} />
 </div>
 <span className="da-panel-label">FOR ENTERPRISE</span>
 <h3 className="da-panel-title">
 Posting Sekali. Dapat Pilot Terbaik dalam 48 Jam.
 </h3>
 <ul className="da-panel-bullets">
 {enterpriseBullets.map((item, i) => (
 <li
 key={i}
 className="da-bullet"
 ref={(el) => (leftBulletsRef.current[i] = el)}
 >
 <CheckCircle2 size={16} strokeWidth={2} />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 <Link to={getRegisterPath('client')} className="da-panel-cta">
 Posting Proyek
 <ArrowRight size={16} strokeWidth={2} />
 </Link>
 <div className="da-panel-stat">
 <span className="da-stat-number">
 <AnimatedStat end={47} />
 </span>
 <span className="da-stat-text">proyek aktif minggu ini</span>
 </div>
 </div>
 </div>


 <div className="da-divider">
 <div className="da-divider-line" />
 <div className="da-center-node" ref={centerNodeRef}>
 <ArrowLeftRight size={20} strokeWidth={2} />
 </div>
 <div className="da-divider-line" />
 </div>


 <div className="da-panel da-panel--right" ref={rightPanelRef}>
 <div className="da-panel-inner">
 <div className="da-panel-icon">
 <Plane size={28} strokeWidth={1.5} />
 </div>
 <span className="da-panel-label">FOR PILOTS</span>
 <h3 className="da-panel-title">
 Drone Anda Layak Dapat Proyek Korporat.
 </h3>
 <ul className="da-panel-bullets">
 {pilotBullets.map((item, i) => (
 <li
 key={i}
 className="da-bullet"
 ref={(el) => (rightBulletsRef.current[i] = el)}
 >
 <CheckCircle2 size={16} strokeWidth={2} />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 <Link to={getRegisterPath('pilot')} className="da-panel-cta da-panel-cta--alt">
 Daftar Sebagai Pilot
 <ArrowRight size={16} strokeWidth={2} />
 </Link>
 <div className="da-panel-stat">
 <span className="da-stat-text">Pilot pertama bid rata-rata</span>
 <span className="da-stat-number">
 <AnimatedStat end={3} suffix=" jam" />
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}

export default DualAudience;
