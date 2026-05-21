import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ target, suffix = '', duration = 2200 }) {
 const [count, setCount] = useState(0);
 const ref = useRef(null);
 const hasAnimated = useRef(false);

 useEffect(() => {
 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting && !hasAnimated.current) {
 hasAnimated.current = true;
 const startTime = performance.now();

 const animate = (currentTime) => {
 const elapsed = currentTime - startTime;
 const progress = Math.min(elapsed / duration, 1);
 const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
 setCount(Math.floor(eased * target));
 if (progress < 1) requestAnimationFrame(animate);
 };

 requestAnimationFrame(animate);
 }
 },
 { threshold: 0.5 }
 );

 if (ref.current) observer.observe(ref.current);
 return () => observer.disconnect();
 }, [target, duration]);

 return <span ref={ref}>{count}{suffix}</span>;
}

const iconMap = {
 briefcase: (
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
 <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
 </svg>
 ),
 users: (
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
 <circle cx="9" cy="7" r="4"/>
 <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
 <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
 </svg>
 ),
 map: (
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/>
 <line x1="9" y1="3" x2="9" y2="18"/>
 <line x1="15" y1="6" x2="15" y2="21"/>
 </svg>
 ),
 alert: (
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
 <line x1="12" y1="9" x2="12" y2="13"/>
 <line x1="12" y1="17" x2="12.01" y2="17"/>
 </svg>
 ),
};

export default function FloatingStats({ stats }) {
 return (
 <div className="floating-stats">
 {stats.map((stat, index) => (
 <div
 key={index}
 className="floating-stat-card"
 style={{ '--stat-color': stat.color }}
 >
 <div className="floating-stat-card__icon">
 {iconMap[stat.icon]}
 </div>
 <div className="floating-stat-card__content">
 <span className="floating-stat-card__value">
 <AnimatedCounter target={stat.value} suffix={stat.suffix} />
 </span>
 <span className="floating-stat-card__label">{stat.label}</span>
 </div>
 </div>
 ))}
 </div>
 );
}
