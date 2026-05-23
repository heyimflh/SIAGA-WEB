import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES, getRegisterPath, getLoginRedirectPath } from '../routes/appRoutes';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
 {
 title: 'Produk',
 links: [
 { label: 'Beranda', to: ROUTES.home },
 { label: 'Cara Kerja', to: ROUTES.howItWorks },
 { label: 'Harga', to: ROUTES.pricing },
 { label: 'Pilot UAV', to: ROUTES.pilots },
 { label: 'Job Radar', to: getLoginRedirectPath(ROUTES.pilotJobRadar) },
 ],
 },
 {
 title: 'Untuk Client',
 links: [
 { label: 'Mulai sebagai Client', to: getRegisterPath('client') },
 { label: 'Lihat Paket Harga', to: ROUTES.pricing },
 { label: 'Lihat Pilot', to: ROUTES.pilots },
 { label: 'Generate Report', to: getLoginRedirectPath(ROUTES.clientReportGenerator) },
 ],
 },
 {
 title: 'Untuk Pilot',
 links: [
 { label: 'Gabung sebagai Pilot', to: getRegisterPath('pilot') },
 { label: 'Login Pilot', to: ROUTES.login },
 { label: 'Job Radar', to: getLoginRedirectPath(ROUTES.pilotJobRadar) },
 { label: 'Dashboard Pilot', to: getLoginRedirectPath(ROUTES.pilotDashboard) },
 ],
 },
 {
 title: 'Platform',
 links: [
 { label: 'Login', to: ROUTES.login },
 { label: 'Register', to: ROUTES.register },
 { label: 'Trust & Safety', to: `${ROUTES.pricing}#security` },
 { label: 'Cara Kerja', to: ROUTES.howItWorks },
 ],
 },
];

const socialLinks = [
 {
 label: 'LinkedIn',
 href: '#',
 svg: (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
 <rect x="2" y="9" width="4" height="12" />
 <circle cx="4" cy="4" r="2" />
 </svg>
 ),
 },
 {
 label: 'Instagram',
 href: '#',
 svg: (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
 <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
 </svg>
 ),
 },
 {
 label: 'X / Twitter',
 href: '#',
 svg: (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
 <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
 </svg>
 ),
 },
 {
 label: 'YouTube',
 href: '#',
 svg: (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
 <path d="m10 15 5-3-5-3z" />
 </svg>
 ),
 },
];

function Footer() {
 const footerRef = useRef(null);

 useEffect(() => {
 const footer = footerRef.current;
 if (!footer) return;

 const topArea = footer.querySelector('.sf-top');
 const wordmark = footer.querySelector('.sf-wordmark');
 const bottomBar = footer.querySelector('.sf-bottom');

 const ctx = gsap.context(() => {
 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: footer,
 start: 'top 88%',
 toggleActions: 'play none none reverse',
 },
 });

 tl.fromTo(
 topArea,
 { opacity: 0, y: 24 },
 { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
 )
 .fromTo(
 wordmark,
 { opacity: 0, y: 16 },
 { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
 '-=0.3'
 )
 .fromTo(
 bottomBar,
 { opacity: 0 },
 { opacity: 1, duration: 0.5, ease: 'power2.out' },
 '-=0.3'
 );
 }, footerRef);

 return () => ctx.revert();
 }, []);

 return (
 <footer ref={footerRef} className="sf" aria-label="Site footer">

 <div className="sf__divider" aria-hidden="true" />

 <div className="sf-top">
 <div className="sf-container">
 <div className="sf-grid">
 <div className="sf-brand">
 <img
 src="/images/logo/siaga-full.png"
 alt="SIAGA"
 className="sf-brand__logo"
 />
 <p className="sf-brand__tagline">
 Platform inspeksi drone B2B untuk infrastruktur kritis Indonesia.
 </p>

 <div className="sf-social">
 {socialLinks.map((social) => (
 <a
 key={social.label}
 href={social.href}
 className="sf-social__link"
 aria-label={social.label}
 >
 {social.svg}
 </a>
 ))}
 </div>
 </div>

 <div className="sf-links">
 {footerLinks.map((col) => (
 <div key={col.title} className="sf-links__col">
 <h4 className="sf-links__title">{col.title}</h4>
 <ul className="sf-links__list">
 {col.links.map((link) => (
 <li key={link.label}>
 <Link to={link.to} className="sf-links__item">
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>


 <div className="sf-wordmark" aria-hidden="true">
 <span className="sf-wordmark__text">SIAGA</span>
 </div>


 <div className="sf-bottom">
 <div className="sf-container">
 <div className="sf-bottom__inner">
 <span className="sf-bottom__copy">
 © 2026 SIAGA. All rights reserved.
 </span>
 <span className="sf-bottom__statement">
 Built for critical infrastructure inspection in Indonesia.
 </span>
 </div>
 </div>
 </div>
 </footer>
 );
}

export default Footer;
