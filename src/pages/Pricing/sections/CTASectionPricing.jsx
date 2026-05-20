import { Link } from 'react-router-dom';
import { ROUTES, getRegisterPath } from '../../../routes/appRoutes';
import './CTASectionPricing.css';

const trustChips = ['Escrow Protected', 'Verified Pilots', 'PDF Report', 'No Hidden Fees'];

export default function CTASectionPricing() {
  return (
    <section className="cta-pr">
      <div className="cta-pr__bg" aria-hidden="true">
        <div className="cta-pr__grid"/>
        <div className="cta-pr__glow"/>
      </div>
      <div className="cta-pr__container">
        <h2 className="cta-pr__title">Mulai Inspeksi Pertama Anda Hari Ini</h2>
        <p className="cta-pr__subtitle">Pilih paket sesuai kebutuhan, gunakan escrow untuk transaksi aman, dan kelola inspeksi infrastruktur dalam satu platform SIAGA.</p>
        <div className="cta-pr__chips" aria-hidden="true">
          {trustChips.map((c) => <span key={c} className="cta-pr__chip">{c}</span>)}
        </div>
        <div className="cta-pr__buttons">
          <Link to={getRegisterPath('client')} className="cta-pr__btn cta-pr__btn--primary">Daftar Sekarang</Link>
          <Link to={ROUTES.howItWorks} className="cta-pr__btn cta-pr__btn--secondary">Lihat Cara Kerja</Link>
        </div>
      </div>
    </section>
  );
}
