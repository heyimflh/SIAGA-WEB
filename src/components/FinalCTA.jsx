import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Users, Zap, CreditCard } from 'lucide-react';
import { ROUTES, getRegisterPath } from '../routes/appRoutes';
import './FinalCTA.css';

gsap.registerPlugin(ScrollTrigger);

function FinalCTA() {
 const sectionRef = useRef(null);
 const contentRef = useRef(null);

 useEffect(() => {
 const section = sectionRef.current;
 const content = contentRef.current;
 if (!section || !content) return;

 const ctx = gsap.context(() => {
 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: section,
 start: 'top 75%',
 end: 'top 30%',
 toggleActions: 'play none none reverse',
 },
 });

 tl.fromTo(
 '.fcta__eyebrow',
 { opacity: 0, y: 20 },
 { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
 )
 .fromTo(
 '.fcta__title',
 { opacity: 0, y: 40 },
 { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
 '-=0.3'
 )
 .fromTo(
 '.fcta__subtitle',
 { opacity: 0, y: 24 },
 { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
 '-=0.4'
 )
 .fromTo(
 '.fcta__actions',
 { opacity: 0, y: 20, scale: 0.96 },
 { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
 '-=0.3'
 )
 .fromTo(
 '.fcta__trust',
 { opacity: 0, y: 16 },
 { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
 '-=0.2'
 )
 .fromTo(
 '.fcta__login',
 { opacity: 0 },
 { opacity: 1, duration: 0.4, ease: 'power2.out' },
 '-=0.1'
 );
 }, sectionRef);

 return () => ctx.revert();
 }, []);

 return (
 <section
 ref={sectionRef}
 className="fcta"
 aria-label="Final call to action"
 >
 <div className="fcta__bg" aria-hidden="true">
 <div className="fcta__glow-center" />
 <div className="fcta__glow-ring" />
 <div className="fcta__grid-lines" />
 </div>

 <div ref={contentRef} className="fcta__shell">

 <div className="fcta__eyebrow">
 <span className="fcta__eyebrow-dot" />
 Platform Inspeksi Drone #1 Indonesia
 </div>


 <h2 className="fcta__title">
 Mulai Inspeksi
 <br />
 <span className="fcta__title-accent">Pertama Anda.</span>
 </h2>

 <p className="fcta__subtitle">
 Dari posting proyek hingga laporan profesional — semua berjalan otomatis.
 <br />
 Bergabung dengan ratusan perusahaan yang sudah mempercayai SIAGA.
 </p>


 <div className="fcta__actions">
 <Link to={getRegisterPath('client')} className="fcta__btn-primary">
 <span>Daftar Gratis Sekarang</span>
 <ArrowRight size={18} strokeWidth={2.5} />
 </Link>
 </div>

 <div className="fcta__trust">
 <div className="fcta__chip">
 <CreditCard size={14} />
 <span>Tanpa kartu kredit</span>
 </div>
 <div className="fcta__chip">
 <Users size={14} />
 <span>500+ pilot tersertifikasi</span>
 </div>
 <div className="fcta__chip">
 <Zap size={14} />
 <span>Setup dalam 2 menit</span>
 </div>
 <div className="fcta__chip">
 <Shield size={14} />
 <span>Enterprise-grade security</span>
 </div>
 </div>


 <p className="fcta__login">
 Sudah punya akun?{' '}
 <Link to={ROUTES.login} className="fcta__login-link">
 Masuk di sini
 <ArrowRight size={13} strokeWidth={2.5} />
 </Link>
 </p>
 </div>


 <div className="fcta__divider" aria-hidden="true" />
 </section>
 );
}

export default FinalCTA;
