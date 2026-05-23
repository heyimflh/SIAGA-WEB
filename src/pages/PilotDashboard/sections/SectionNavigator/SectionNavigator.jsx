import { useEffect, useRef, useCallback } from 'react';
import './SectionNavigator.css';

const SECTIONS = [
 { id: 'section-overview', label: 'Overview' },
 { id: 'section-bid', label: 'Bid' },
 { id: 'section-misi', label: 'Misi' },
 { id: 'section-workspace', label: 'Workspace' },
 { id: 'section-earnings', label: 'Earnings' },
 { id: 'section-reviews', label: 'Reviews' },
 { id: 'section-aksi', label: 'Aksi' },
];

function SectionNavigator({ activeSection, onSectionClick }) {
 const navRef = useRef(null);

 useEffect(() => {
 const observer = new IntersectionObserver(
 (entries) => {
 for (const entry of entries) {
 if (entry.isIntersecting) {
 onSectionClick(entry.target.id);
 }
 }
 },
 { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
 );

 SECTIONS.forEach(({ id }) => {
 const el = document.getElementById(id);
 if (el) observer.observe(el);
 });

 return () => observer.disconnect();
 }, [onSectionClick]);

 const handleClick = useCallback((id) => {
 document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
 }, []);

 return (
 <nav className="pilot-sticky-nav" ref={navRef} aria-label="Section navigation">
 <div className="pilot-sticky-nav__inner">
 {SECTIONS.map(({ id, label }) => (
 <button
 key={id}
 type="button"
 className={`pilot-sticky-nav__item ${activeSection === id ? 'pilot-sticky-nav__item--active' : ''}`}
 onClick={() => handleClick(id)}
 aria-current={activeSection === id ? 'true' : undefined}
 >
 {label}
 </button>
 ))}
 </div>
 </nav>
 );
}

export default SectionNavigator;
