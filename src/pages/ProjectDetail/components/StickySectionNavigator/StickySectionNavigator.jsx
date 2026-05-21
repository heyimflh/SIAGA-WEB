import { useEffect, useRef } from 'react';
import './StickySectionNavigator.css';

export default function StickySectionNavigator({ sections, activeSectionId, onSectionChange }) {
 const navRef = useRef(null);

 useEffect(() => {
 const observer = new IntersectionObserver(
 (entries) => {
 for (const entry of entries) {
 if (entry.isIntersecting) {
 onSectionChange(entry.target.id);
 }
 }
 },
 { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
 );

 sections.forEach(({ id }) => {
 const el = document.getElementById(id);
 if (el) observer.observe(el);
 });

 return () => observer.disconnect();
 }, [sections, onSectionChange]);

 const handleClick = (id) => {
 document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
 };

 return (
 <nav className="pd-sticky-nav" ref={navRef} aria-label="Section navigation">
 <div className="pd-sticky-nav__inner">
 {sections.map(({ id, label }) => (
 <button
 key={id}
 className={`pd-sticky-nav__item ${activeSectionId === id ? 'pd-sticky-nav__item--active' : ''}`}
 onClick={() => handleClick(id)}
 aria-current={activeSectionId === id ? 'true' : undefined}
 >
 {label}
 </button>
 ))}
 </div>
 </nav>
 );
}
