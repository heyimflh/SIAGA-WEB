import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
 ArrowRight,
 CheckCircle2,
 X,
 Building2,
 Plane,
} from 'lucide-react';
import { getRegisterPath } from '../../routes/appRoutes';
import './Pricing.css';

gsap.registerPlugin(ScrollTrigger);

const enterpriseFeatures = [
 'Posting proyek inspeksi tanpa biaya awal',
 'Akses pilot bersertifikat',
 'Budget dan bidding transparan',
 'Escrow payment sampai laporan disetujui',
 'One-click PDF report untuk hasil inspeksi',
];

const pilotFeatures = [
 'Bid proyek tanpa biaya',
 'Profil pilot dan portofolio digital',
 'Verified badge untuk pilot tervalidasi',
 'Pembayaran lebih aman melalui escrow',
 'Riwayat misi membangun reputasi',
];

const enterpriseTiers = [
 { label: 'Free', price: 'Rp 0', desc: 'Untuk mulai posting proyek' },
 { label: 'Pro', price: 'Coming Soon', desc: 'Monitoring dan laporan branded' },
 { label: 'Enterprise', price: 'Custom', desc: 'Workflow, API, dan success support' },
];

const pilotTiers = [
 { label: 'Free', price: 'Rp 0', desc: 'Bid proyek dan bangun profil' },
 { label: 'Verified+', price: 'Beta Access', desc: 'Priority listing dan badge lanjutan' },
 { label: 'Agency', price: 'Coming Soon', desc: 'Kelola beberapa pilot dan misi' },
];

const negativeChips = [
 'Tidak ada biaya posting',
 'Tidak ada biaya bid',
 'Tidak ada biaya tersembunyi',
 'Tidak ada biaya pembatalan awal',
];

function AnimatedPercent({ end, duration = 1500 }) {
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
 el.textContent = Math.round(eased * end) + '%';
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
 }, [end, duration]);

 return <span ref={ref} className="pr-highlight-number">0%</span>;
}

function Pricing() {
 const sectionRef = useRef(null);
 const headerRef = useRef(null);
 const leftCardRef = useRef(null);
 const rightCardRef = useRef(null);
 const chipsRef = useRef(null);

 useEffect(() => {
 const prefersReduced = window.matchMedia(
 '(prefers-reduced-motion: reduce)'
 ).matches;
 if (prefersReduced) return;

 const ctx = gsap.context(() => {

 gsap.fromTo(
 headerRef.current,
 { y: 30, opacity: 0 },
 {
 y: 0,
 opacity: 1,
 duration: 0.7,
 ease: 'power3.out',
 scrollTrigger: {
 trigger: sectionRef.current,
 start: 'top 75%',
 toggleActions: 'play none none reverse',
 },
 }
 );


 gsap.fromTo(
 leftCardRef.current,
 { x: -40, opacity: 0 },
 {
 x: 0,
 opacity: 1,
 duration: 0.8,
 ease: 'power3.out',
 scrollTrigger: {
 trigger: sectionRef.current,
 start: 'top 65%',
 toggleActions: 'play none none reverse',
 },
 }
 );


 gsap.fromTo(
 rightCardRef.current,
 { x: 40, opacity: 0 },
 {
 x: 0,
 opacity: 1,
 duration: 0.8,
 ease: 'power3.out',
 scrollTrigger: {
 trigger: sectionRef.current,
 start: 'top 65%',
 toggleActions: 'play none none reverse',
 },
 }
 );


 if (chipsRef.current) {
 gsap.fromTo(
 chipsRef.current,
 { y: 20, opacity: 0 },
 {
 y: 0,
 opacity: 1,
 duration: 0.6,
 ease: 'power3.out',
 scrollTrigger: {
 trigger: chipsRef.current,
 start: 'top 85%',
 toggleActions: 'play none none reverse',
 },
 }
 );
 }
 }, sectionRef);

 return () => ctx.revert();
 }, []);

 return (
 <section className="pr-section" ref={sectionRef}>

 <div className="pr-bg" aria-hidden="true">
 <div className="pr-bg-grid" />
 </div>

 <div className="pr-container">

 <div className="pr-header" ref={headerRef}>
 <span className="pr-eyebrow">TRANSPARENT PRICING</span>
 <h2 className="pr-headline">
 Posting Gratis. Bayar hanya saat proyek selesai.
 </h2>
 <p className="pr-subheadline">
 Transparansi biaya sejak awal — perusahaan tidak membayar sebelum
 proyek berjalan, pilot mengetahui komisi platform sebelum menerima
 pekerjaan.
 </p>
 </div>


 <div className="pr-cards">

 <div className="pr-card pr-card--enterprise" ref={leftCardRef}>
 <div className="pr-card-header">
 <div className="pr-card-icon">
 <Building2 size={22} strokeWidth={1.8} />
 </div>
 <span className="pr-card-label">UNTUK PERUSAHAAN</span>
 </div>

 <div className="pr-card-pricing">
 <h3 className="pr-card-price">Posting Gratis</h3>
 <p className="pr-card-price-sub">
 Bayar hanya saat pilot dipilih dan proyek berjalan.
 </p>
 </div>

 <div className="pr-card-highlight pr-card-highlight--blue">
 <span>Rp 0</span> biaya posting
 </div>

 <ul className="pr-card-features">
 {enterpriseFeatures.map((feature, i) => (
 <li key={i} className="pr-feature">
 <CheckCircle2 size={15} strokeWidth={2} />
 <span>{feature}</span>
 </li>
 ))}
 </ul>


 <Link to={getRegisterPath('client')} className="pr-card-cta pr-card-cta--primary">
 Posting Proyek
 <ArrowRight size={16} strokeWidth={2} />
 </Link>


 <div className="pr-tiers">
 {enterpriseTiers.map((tier, i) => (
 <div key={i} className="pr-tier">
 <div className="pr-tier-top">
 <span className="pr-tier-label">{tier.label}</span>
 <span className="pr-tier-price">{tier.price}</span>
 </div>
 <span className="pr-tier-desc">{tier.desc}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="pr-card pr-card--pilot" ref={rightCardRef}>
 <div className="pr-card-header">
 <div className="pr-card-icon pr-card-icon--cyan">
 <Plane size={22} strokeWidth={1.8} />
 </div>
 <span className="pr-card-label pr-card-label--cyan">UNTUK PILOT</span>
 </div>

 <div className="pr-card-pricing">
 <h3 className="pr-card-price">Daftar Gratis</h3>
 <p className="pr-card-price-sub">
 Simpan 93% pendapatan proyek. Komisi platform hanya 7% saat
 proyek selesai.
 </p>
 </div>

 <div className="pr-card-highlight pr-card-highlight--cyan">
 Komisi <AnimatedPercent end={7} /> transparan
 </div>


 <ul className="pr-card-features">
 {pilotFeatures.map((feature, i) => (
 <li key={i} className="pr-feature">
 <CheckCircle2 size={15} strokeWidth={2} />
 <span>{feature}</span>
 </li>
 ))}
 </ul>


 <Link to={getRegisterPath('pilot')} className="pr-card-cta pr-card-cta--secondary">
 Daftar Sebagai Pilot
 <ArrowRight size={16} strokeWidth={2} />
 </Link>


 <div className="pr-tiers">
 {pilotTiers.map((tier, i) => (
 <div key={i} className="pr-tier">
 <div className="pr-tier-top">
 <span className="pr-tier-label">{tier.label}</span>
 <span className="pr-tier-price">{tier.price}</span>
 </div>
 <span className="pr-tier-desc">{tier.desc}</span>
 </div>
 ))}
 </div>
 </div>
 </div>


 <div className="pr-negative" ref={chipsRef}>
 <p className="pr-negative-title">Apa yang tidak kami biayakan</p>
 <div className="pr-negative-chips">
 {negativeChips.map((chip, i) => (
 <div key={i} className="pr-chip">
 <X size={14} strokeWidth={2.5} />
 <span>{chip}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 );
}

export default Pricing;
