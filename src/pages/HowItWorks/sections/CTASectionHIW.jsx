import { Link } from 'react-router-dom';
import { getRegisterPath } from '../../../routes/appRoutes';
import './CTASectionHIW.css';

const trustChips = ['Verified Pilot', 'Escrow Protected', 'Live Monitoring', 'PDF Report'];

export default function CTASectionHIW() {
 return (
 <section className="cta-hiw">
 <div className="cta-hiw__bg" aria-hidden="true">
 <div className="cta-hiw__grid"/>
 <div className="cta-hiw__glow"/>
 </div>

 <div className="cta-hiw__container">
 <h2 className="cta-hiw__title">
 Siap Memulai Inspeksi Pertama Anda?
 </h2>
 <p className="cta-hiw__subtitle">
 Buat project brief, temukan pilot UAV tersertifikasi, dan dapatkan laporan inspeksi profesional dalam satu platform SIAGA.
 </p>

 <div className="cta-hiw__chips" aria-hidden="true">
 {trustChips.map((chip) => (
 <span key={chip} className="cta-hiw__chip">{chip}</span>
 ))}
 </div>

 <div className="cta-hiw__buttons">
 <Link to={getRegisterPath('client')} className="cta-hiw__btn cta-hiw__btn--primary">
 Mulai sebagai Client
 </Link>
 <Link to={getRegisterPath('pilot')} className="cta-hiw__btn cta-hiw__btn--secondary">
 Gabung sebagai Pilot
 </Link>
 </div>
 </div>
 </section>
 );
}
