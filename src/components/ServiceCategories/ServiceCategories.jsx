import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { categories } from './categories-data';
import { getRegisterPath } from '../../routes/appRoutes';
import './ServiceCategories.css';

gsap.registerPlugin(ScrollTrigger);

function AnimatedCount({ end, duration = 2000 }) {
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
 el.textContent = Math.round(eased * end);
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

 return <span ref={ref}>0</span>;
}

function ServiceCategories() {
 const sectionRef = useRef(null);
 const headerRef = useRef(null);
 const cardsRef = useRef([]);

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

 const cards = cardsRef.current.filter(Boolean);
 if (cards.length) {
 gsap.fromTo(
 cards,
 { y: 50, opacity: 0, scale: 0.96 },
 {
 y: 0,
 opacity: 1,
 scale: 1,
 duration: 0.7,
 stagger: 0.08,
 ease: 'power3.out',
 scrollTrigger: {
 trigger: sectionRef.current,
 start: 'top 60%',
 toggleActions: 'play none none reverse',
 },
 }
 );
 }
 }, sectionRef);

 return () => ctx.revert();
 }, []);

 return (
 <section className="sc-section" ref={sectionRef}>
 {/* Background effects */}
 <div className="sc-bg" aria-hidden="true">
 <div className="sc-bg-grid" />
 <div className="sc-bg-glow sc-bg-glow--1" />
 <div className="sc-bg-glow sc-bg-glow--2" />
 </div>

 <div className="sc-container">
 {/* Header */}
 <div className="sc-header" ref={headerRef}>
 <span className="sc-eyebrow">SERVICE MARKETPLACE</span>
 <h2 className="sc-headline">
 Inspeksi Apa yang Anda Butuhkan?
 </h2>
 <p className="sc-subheadline">
 Pilih kategori inspeksi, temukan pilot terspesialisasi, dan mulai
 proyek dengan standar laporan yang siap untuk kebutuhan enterprise.
 </p>
 </div>

 {/* Bento Grid */}
 <div className="sc-bento">
 {categories.map((cat, index) => {
 const Icon = cat.icon;
 const isLarge = index === 0 || index === 3;
 return (
 <div
 key={cat.id}
 className={`sc-bento-card ${isLarge ? 'sc-bento-card--large' : 'sc-bento-card--small'}`}
 ref={(el) => (cardsRef.current[index] = el)}
 style={{ '--card-accent': cat.accent }}
 >
 {/* Image */}
 <div className="sc-bento-img">
 <img
 src={cat.thumbnail}
 alt={cat.name}
 loading="lazy"
 />
 </div>

 {/* Dark overlay */}
 <div className="sc-bento-overlay" />

 {/* Content */}
 <div className="sc-bento-content">
 {/* Icon badge - top left */}
 <div className="sc-bento-icon">
 <Icon size={18} strokeWidth={2} />
 </div>

 {/* Info block at bottom */}
 <div className="sc-bento-info">
 <h3 className="sc-bento-title">{cat.name}</h3>

 {/* Description - only on large cards always visible, small cards on hover */}
 <p className="sc-bento-desc">{cat.description}</p>

 {/* Meta line - clean single row */}
 <div className="sc-bento-meta">
 <span className="sc-bento-pilots">
 <AnimatedCount end={cat.pilots} /> pilot
 </span>
 <span className="sc-bento-dot">·</span>
 <span className="sc-bento-price">{cat.startingPrice}</span>
 </div>
 </div>

 {/* Hover CTA arrow */}
 <Link to={getRegisterPath('client')} className="sc-bento-cta" aria-label={`Lihat detail ${cat.name}`}>
 <ArrowUpRight size={18} strokeWidth={2.5} />
 </Link>
 </div>
 </div>
 );
 })}
 </div>

 {/* Bottom CTA */}
 <div className="sc-bottom-cta">
 <Link to={getRegisterPath('client')} className="sc-cta-btn">
 Mulai Posting Inspeksi
 <ArrowRight size={16} strokeWidth={2} />
 </Link>
 <p className="sc-cta-sub">Gratis posting • Tanpa komitmen</p>
 </div>
 </div>
 </section>
 );
}

export default ServiceCategories;
