import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Radio, MapPin, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
 {
 end: 500,
 suffix: '+',
 label: 'Pilot Tersertifikasi',
 icon: Users,
 description: 'Profesional terverifikasi',
 },
 {
 end: 1200,
 suffix: '+',
 useThousandSep: true,
 label: 'Menara Terinspeksi',
 icon: Radio,
 description: 'Tower & infrastruktur',
 },
 {
 end: 47,
 suffix: '',
 label: 'Kota Aktif',
 icon: MapPin,
 description: 'Jangkauan nasional',
 },
 {
 end: 99.8,
 suffix: '%',
 decimals: 1,
 label: 'Uptime Platform',
 icon: Activity,
 description: 'Keandalan sistem',
 },
];

function easeOutExpo(t) {
 return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function formatNumber(value, decimals = 0, useThousandSep = false) {
 const fixed = value.toFixed(decimals);
 if (!useThousandSep) return fixed;
 const parts = fixed.split('.');
 parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
 return parts.join(',');
}

function AnimatedNumber({ end, decimals = 0, suffix = '', useThousandSep = false, duration = 2500 }) {
 const [display, setDisplay] = useState('0' + suffix);
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
 const easedProgress = easeOutExpo(progress);
 const current = easedProgress * end;
 setDisplay(formatNumber(current, decimals, useThousandSep) + suffix);
 if (progress < 1) {
 requestAnimationFrame(animate);
 }
 }

 requestAnimationFrame(animate);
 }
 });
 },
 { threshold: 0.3 }
 );

 observer.observe(el);
 return () => observer.disconnect();
 }, [end, decimals, suffix, useThousandSep, duration]);

 return (
 <span className="stat-number" ref={ref}>
 {display}
 </span>
 );
}

function StatsBar() {
 const sectionRef = useRef(null);
 const containerRef = useRef(null);
 const statRefs = useRef([]);
 const decorRef = useRef(null);

 useEffect(() => {
 const section = sectionRef.current;
 const container = containerRef.current;
 const items = statRefs.current.filter(Boolean);
 const decor = decorRef.current;

 const ctx = gsap.context(() => {

 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: section,
 start: 'top 85%',
 end: 'top 40%',
 toggleActions: 'play none none reverse',
 },
 });


 tl.fromTo(
 container,
 {
 y: 60,
 opacity: 0,
 scale: 0.96,
 },
 {
 y: 0,
 opacity: 1,
 scale: 1,
 duration: 1,
 ease: 'power3.out',
 }
 );


 if (decor?.children?.length) {
 tl.fromTo(
 Array.from(decor.children),
 { scale: 0, opacity: 0 },
 {
 scale: 1,
 opacity: 1,
 duration: 0.6,
 stagger: 0.1,
 ease: 'back.out(1.7)',
 },
 '-=0.5'
 );
 }


 if (items.length) {
 tl.fromTo(
 items,
 {
 y: 30,
 opacity: 0,
 },
 {
 y: 0,
 opacity: 1,
 duration: 0.7,
 stagger: 0.12,
 ease: 'power3.out',
 },
 '-=0.6'
 );
 }


 const seps = container?.querySelectorAll('.stats-separator');
 if (seps?.length) {
 tl.fromTo(
 seps,
 { scaleY: 0, opacity: 0 },
 {
 scaleY: 1,
 opacity: 1,
 duration: 0.5,
 stagger: 0.08,
 ease: 'power2.out',
 },
 '-=0.5'
 );
 }


 }, sectionRef);

 return () => ctx.revert();
 }, []);

 return (
 <section className="stats-section" ref={sectionRef} id="stats-bar">
 <div className="stats-bg-decor" ref={decorRef}>
 <div className="stats-orb stats-orb-1" />
 <div className="stats-orb stats-orb-2" />
 <div className="stats-grid-pattern" />
 </div>

 <div className="stats-accent-line" />

 <div className="stats-container" ref={containerRef}>
 {stats.map((stat, index) => {
 const Icon = stat.icon;
 return (
 <div key={index} className="stats-wrapper">
 {index > 0 && (
 <div className="stats-separator">
 <div className="stats-separator-glow" />
 </div>
 )}

 <div
 className="stat-item"
 ref={(el) => (statRefs.current[index] = el)}
 >
 <div className="stat-icon-wrapper">
 <div className="stat-icon-bg" />
 <Icon size={20} strokeWidth={2} />
 </div>

 <div className="stat-number-wrapper">
 <AnimatedNumber
 end={stat.end}
 decimals={stat.decimals || 0}
 suffix={stat.suffix}
 useThousandSep={stat.useThousandSep || false}
 duration={2500}
 />
 </div>

 <span className="stat-label">{stat.label}</span>

 <span className="stat-desc">{stat.description}</span>

 <div className="stat-hover-glow" />
 </div>
 </div>
 );
 })}
 </div>

 <div className="stats-accent-line stats-accent-line-bottom" />
 </section>
 );
}

export default StatsBar;
