import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ROUTES, getRegisterPath } from '../routes/appRoutes';

export default function Navbar() {
 const [scrolled, setScrolled] = useState(false);
 const [mobileOpen, setMobileOpen] = useState(false);
 const [onDark, setOnDark] = useState(false);
 const headerRef = useRef(null);
 const location = useLocation();

 // Determine if we're on the landing page (for section anchors)
 const isLanding = location.pathname === '/';

 useEffect(() => {
 const handleScroll = () => {
 setScrolled(window.scrollY > 60);

 // Detect if navbar logo overlaps a dark section
 const logoEl = document.querySelector('.brand-float__img');
 if (!logoEl) return;
 const logoRect = logoEl.getBoundingClientRect();
 const logoCenterY = logoRect.top + logoRect.height / 2;
 const logoCenterX = logoRect.left + logoRect.width / 2;

 const darkSections = document.querySelectorAll('.closing-section');
 let isOverDark = false;
 for (const section of darkSections) {
 const rect = section.getBoundingClientRect();
 if (logoCenterY >= rect.top && logoCenterY <= rect.bottom &&
 logoCenterX >= rect.left && logoCenterX <= rect.right) {
 isOverDark = true;
 break;
 }
 }
 setOnDark(isOverDark);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 handleScroll();
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 useEffect(() => {
 const ctx = gsap.context(() => {
 gsap.fromTo(
 '.brand-float',
 { y: -20, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 2.0 }
 );
 gsap.fromTo(
 '.nav-pill',
 { y: -20, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 2.1 }
 );
 gsap.fromTo(
 '.nav-actions',
 { y: -20, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 2.2 }
 );
 gsap.fromTo(
 '.nav-mobile-toggle',
 { y: -20, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 2.1 }
 );
 }, headerRef);

 return () => ctx.revert();
 }, []);

 // Close mobile menu on resize
 useEffect(() => {
 const handleResize = () => {
 if (window.innerWidth > 768) setMobileOpen(false);
 };
 window.addEventListener('resize', handleResize);
 return () => window.removeEventListener('resize', handleResize);
 }, []);

 // Lock body scroll when mobile menu is open
 useEffect(() => {
 document.body.style.overflow = mobileOpen ? 'hidden' : '';
 return () => { document.body.style.overflow = ''; };
 }, [mobileOpen]);

 const handleNavClick = () => {
 setMobileOpen(false);
 };

 // Helper: section links use full path from non-landing pages
 const sectionHref = (hash) => isLanding ? `#${hash}` : `/#${hash}`;

 return (
 <>
 <header
 ref={headerRef}
 className={`site-header ${scrolled ? 'is-scrolled' : ''} ${onDark ? 'on-dark' : ''}`}
 >
 <div className="nav-container">
 {/* Left — Floating Logo */}
 <Link to={ROUTES.home} className="brand-float">
 <img
 src="/images/logo/siaga-full.png"
 alt="SIAGA"
 className="brand-float__img"
 />
 </Link>

 {/* Center — Floating Navigation Pill */}
 <nav className="nav-pill">
 <ul className="nav-pill__links">
 <li><a href={sectionHref('fitur')} className="nav-link">Fitur</a></li>
 <li><Link to={ROUTES.howItWorks} className="nav-link">Cara Kerja</Link></li>
 <li><Link to={ROUTES.pricing} className="nav-link">Harga</Link></li>
 <li><Link to={ROUTES.pilots} className="nav-link">Pilot</Link></li>
 </ul>
 </nav>

 {/* Right — Floating Actions */}
 <div className="nav-actions">
 <Link to={ROUTES.login} className="login-link">Masuk</Link>
 <Link to={getRegisterPath('client')} className="nav-cta">
 <span>Coba Gratis</span>
 <svg className="nav-cta__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14M12 5l7 7-7 7"/>
 </svg>
 </Link>
 </div>

 {/* Mobile Toggle */}
 <button
 className={`nav-mobile-toggle ${mobileOpen ? 'nav-mobile-toggle--active' : ''}`}
 onClick={() => setMobileOpen(!mobileOpen)}
 aria-label="Toggle menu"
 aria-expanded={mobileOpen}
 >
 <span className="nav-mobile-toggle__line"></span>
 <span className="nav-mobile-toggle__line"></span>
 <span className="nav-mobile-toggle__line"></span>
 </button>
 </div>
 </header>

 {/* Mobile Menu Panel */}
 <div className={`nav-mobile-panel ${mobileOpen ? 'nav-mobile-panel--open' : ''}`}>
 <div className="nav-mobile-panel__inner">
 <ul className="nav-mobile-panel__links">
 <li><a href={sectionHref('fitur')} className="nav-mobile-panel__link" onClick={handleNavClick}>Fitur</a></li>
 <li><Link to={ROUTES.howItWorks} className="nav-mobile-panel__link" onClick={handleNavClick}>Cara Kerja</Link></li>
 <li><Link to={ROUTES.pricing} className="nav-mobile-panel__link" onClick={handleNavClick}>Harga</Link></li>
 <li><Link to={ROUTES.pilots} className="nav-mobile-panel__link" onClick={handleNavClick}>Pilot</Link></li>
 </ul>
 <div className="nav-mobile-panel__actions">
 <Link to={ROUTES.login} className="nav-mobile-panel__ghost" onClick={handleNavClick}>Masuk</Link>
 <Link to={getRegisterPath('client')} className="nav-mobile-panel__cta" onClick={handleNavClick}>
 <span>Coba Gratis</span>
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14M12 5l7 7-7 7"/>
 </svg>
 </Link>
 </div>
 </div>
 </div>
 </>
 );
}
