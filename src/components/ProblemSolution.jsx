import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProblemSolution.css';

gsap.registerPlugin(ScrollTrigger);

const problems = [
 {
 id: '01',
 stat: '47%',
 title: 'Risiko Kecelakaan Kerja',
 desc: 'Inspeksi manual di ketinggian menempatkan nyawa pekerja dalam bahaya setiap hari — satu kesalahan bisa fatal.',
 },
 {
 id: '02',
 stat: '3–6 bln',
 title: 'Durasi Tender Konvensional',
 desc: 'Proses birokrasi tender manual yang berlarut-larut, memakan waktu berbulan-bulan sebelum inspeksi dimulai.',
 },
 {
 id: '03',
 stat: '0%',
 title: 'Laporan Tidak Standar',
 desc: 'Output inspeksi berbeda-beda antar vendor — tidak bisa dibandingkan, diaudit, atau diintegrasikan.',
 },
 {
 id: '04',
 stat: '∅',
 title: 'Nol Visibilitas Real-Time',
 desc: 'Setelah inspeksi selesai, tidak ada cara memantau kondisi aset secara live — semuanya berjalan buta.',
 },
];

const solutions = [
 {
 id: '01',
 title: 'Zero Risk',
 highlight: 'Safety',
 desc: 'Inspeksi 100% dari darat — drone yang bekerja di ketinggian, bukan manusia. Tidak ada lagi nyawa yang dipertaruhkan untuk sebuah data.',
 tag: 'SAFETY FIRST',
 color: '#CCFF00',
 image: '/images/solutions-card/01 Zero Risk Safety.png',
 },
 {
 id: '02',
 title: '48 Hours',
 highlight: 'Speed',
 desc: 'Sistem bidding real-time, algoritma matching otomatis — tidak ada birokrasi manual. Dari posting job hingga pilot terbang, hanya 48 jam.',
 tag: 'LIGHTNING FAST',
 color: '#00D4FF',
 image: '/images/solutions-card/02 48 Hours Speed.png',
 },
 {
 id: '03',
 title: 'One Click',
 highlight: 'Report',
 desc: 'PDF profesional otomatis dengan standar internasional — siap presentasi boardroom. Satu klik, laporan lengkap tergenerate.',
 tag: 'ENTERPRISE GRADE',
 color: '#FF6B35',
 image: '/images/solutions-card/03 One Click Report.png',
 },
 {
 id: '04',
 title: 'Live Monitor',
 highlight: 'Dashboard',
 desc: 'Real-time kondisi aset pasca-inspeksi dengan visualisasi interaktif dan alerting otomatis. Pantau semua aset dari satu layar.',
 tag: 'ALWAYS ON',
 color: '#A855F7',
 image: '/images/solutions-card/04 Live Monitor Dashboard.png',
 },
];

function SolutionShowcase() {
 const [active, setActive] = useState(0);
 const cardRef = useRef(null);
 const contentRef = useRef(null);
 const current = solutions[active];

 const goNext = useCallback(() => {
 setActive((prev) => (prev + 1) % solutions.length);
 }, []);

 const goPrev = useCallback(() => {
 setActive((prev) => (prev - 1 + solutions.length) % solutions.length);
 }, []);

 useEffect(() => {
 if (!cardRef.current || !contentRef.current) return;

 const tl = gsap.timeline();
 tl.fromTo(cardRef.current,
 { rotateY: -8, scale: 0.92, opacity: 0 },
 { rotateY: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
 );
 tl.fromTo(contentRef.current.children,
 { y: 30, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
 '-=0.4'
 );
 }, [active]);

 return (
 <div className="psx-showcase">
 <div className="psx-showcase-left">
 <div className="psx-vcard" ref={cardRef} style={{ '--accent': current.color }}>
 <div className="psx-vcard-bg" />
 <div className="psx-vcard-image">
 <img src={current.image} alt={current.title} loading="lazy" />
 </div>
 <div className="psx-vcard-overlay" />
 <div className="psx-vcard-number">{current.id}</div>
 <div className="psx-vcard-label">{current.tag}</div>

 <div className="psx-vcard-mobile-title" aria-hidden="true">
 <span className="psx-vcard-mobile-eyebrow">THE SOLUTION</span>
 <span className="psx-vcard-mobile-name">
 {current.title}
 <span className="psx-vcard-mobile-hl" style={{ '--hl-color': current.color }}>
 {' '}{current.highlight}
 </span>
 </span>
 </div>

 <div className="psx-vcard-corner psx-vc-tl" />
 <div className="psx-vcard-corner psx-vc-tr" />
 <div className="psx-vcard-corner psx-vc-bl" />
 <div className="psx-vcard-corner psx-vc-br" />
 </div>


 <div className="psx-nav">
 <button className="psx-nav-btn" onClick={goPrev} aria-label="Previous solution">
 <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
 <path d="M12 3L6 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>
 <span className="psx-nav-count">
 <span className="psx-nav-current">{String(active + 1).padStart(2, '0')}</span>
 <span className="psx-nav-sep">/</span>
 <span className="psx-nav-total">{String(solutions.length).padStart(2, '0')}</span>
 </span>
 <button className="psx-nav-btn" onClick={goNext} aria-label="Next solution">
 <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
 <path d="M6 3l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </button>
 </div>
 </div>

 <div className="psx-showcase-right" ref={contentRef}>
 <div className="psx-showcase-id">{current.id}</div>
 <h3 className="psx-showcase-title">
 {current.title}{' '}
 <span className="psx-showcase-hl" style={{ '--hl-color': current.color }}>
 {current.highlight}
 </span>
 </h3>
 <p className="psx-showcase-desc">{current.desc}</p>
 <div className="psx-showcase-tag">{current.tag}</div>
 </div>
 </div>
 );
}


function ProblemSolution() {
 const sectionRef = useRef(null);

 useEffect(() => {
 const section = sectionRef.current;
 if (!section) return;

 const ctx = gsap.context(() => {


 const hTl = gsap.timeline({
 scrollTrigger: { trigger: '.psx-header', start: 'top 82%', toggleActions: 'play none none reverse' },
 });
 hTl
 .fromTo('.psx-label', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
 .fromTo('.psx-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.3')
 .fromTo('.psx-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4');


 const pRows = section.querySelectorAll('.psx-row-problem');
 pRows.forEach((row, i) => {
 gsap.fromTo(row,
 { x: -80, opacity: 0 },
 {
 x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
 delay: i * 0.08,
 scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' },
 }
 );
 });


 gsap.fromTo('.psx-divider-inner',
 { scaleX: 0, opacity: 0 },
 {
 scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.inOut',
 scrollTrigger: { trigger: '.psx-divider', start: 'top 78%', toggleActions: 'play none none reverse' },
 }
 );
 gsap.fromTo('.psx-divider-text',
 { y: 20, opacity: 0 },
 {
 y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
 scrollTrigger: { trigger: '.psx-divider', start: 'top 72%', toggleActions: 'play none none reverse' },
 }
 );


 gsap.fromTo('.psx-showcase',
 { y: 60, opacity: 0 },
 {
 y: 0, opacity: 1, duration: 1, ease: 'power3.out',
 scrollTrigger: { trigger: '.psx-showcase', start: 'top 82%', toggleActions: 'play none none reverse' },
 }
 );


 gsap.fromTo('.psx-cta',
 { y: 40, opacity: 0 },
 {
 y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
 scrollTrigger: { trigger: '.psx-cta', start: 'top 88%', toggleActions: 'play none none reverse' },
 }
 );

 }, section);

 return () => ctx.revert();
 }, []);

 return (
 <section className="psx-section" ref={sectionRef} id="problem-solution">

 <div className="psx-bg" aria-hidden="true">
 <div className="psx-bg-base" />
 <div className="psx-bg-grain" />
 <div className="psx-bg-orb psx-bg-orb-1" />
 <div className="psx-bg-orb psx-bg-orb-2" />
 <div className="psx-bg-orb psx-bg-orb-3" />
 <div className="psx-bg-lines" />
 </div>


 <header className="psx-header">
 <span className="psx-label">[ PROBLEM × SOLUTION ]</span>
 <h2 className="psx-title">
 INDUSTRI LAMA.<br />
 <span className="psx-title-accent">SOLUSI BARU.</span>
 </h2>
 <p className="psx-desc">
 Inspeksi infrastruktur Indonesia masih terjebak metode konvensional —
 berbahaya, lambat, dan tidak terukur. SIAGA hadir mengubah segalanya.
 </p>
 </header>

 <div className="psx-problems">
 <div className="psx-section-tag">
 <span className="psx-section-tag-dot psx-dot-red" />
 <span>THE PROBLEM</span>
 </div>

 <div className="psx-problems-list">
 {problems.map((item) => (
 <div key={item.id} className="psx-row-problem">
 <div className="psx-row-id">{item.id}</div>
 <div className="psx-row-stat">{item.stat}</div>
 <div className="psx-row-content">
 <h3 className="psx-row-title">{item.title}</h3>
 <p className="psx-row-desc">{item.desc}</p>
 </div>
 <div className="psx-row-line" />
 </div>
 ))}
 </div>
 </div>


 <div className="psx-divider">
 <div className="psx-divider-inner" />
 <span className="psx-divider-text">SIAGA MENGUBAH SEGALANYA</span>
 </div>

 <div className="psx-solutions">
 <div className="psx-section-tag">
 <span className="psx-section-tag-dot psx-dot-blue" />
 <span>THE SOLUTION</span>
 </div>

 <SolutionShowcase />
 </div>


 <div className="psx-cta">
 <div className="psx-cta-line" />
 <p className="psx-cta-main">
 LEBIH AMAN. LEBIH CEPAT. LEBIH TERUKUR.
 </p>
 <p className="psx-cta-sub">Satu platform — semua solusi.</p>
 </div>
 </section>
 );
}

export default ProblemSolution;
