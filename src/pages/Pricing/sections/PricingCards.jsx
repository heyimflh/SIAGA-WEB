import { Link } from 'react-router-dom';
import { pricingTiers } from '../data/pricing-data';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import './PricingCards.css';

export default function PricingCards() {
  return (
    <section className="pc" id="pricing-tiers">
      <div className="pc__container">
        <SupportingSectionHeader
          eyebrow="PRICING TIERS"
          title="Pilih Paket Sesuai Skala Operasional Anda"
          subtitle="Mulai dari proyek kecil, lalu upgrade saat kebutuhan monitoring, laporan, dan operasional inspeksi Anda semakin kompleks."
        />

        <div className="pc__grid">
          {pricingTiers.map((tier) => (
            <div key={tier.id} className={`pc__card pc__card--${tier.style}`}>
              {tier.badge && <span className={`pc__badge pc__badge--${tier.style}`}>{tier.badge}</span>}
              <div className="pc__header">
                <h3 className="pc__label">{tier.label}</h3>
                <p className="pc__subtitle">{tier.subtitle}</p>
              </div>
              <div className="pc__price">
                <span className="pc__price-amount">{tier.price}</span>
                <span className="pc__price-period">{tier.pricePeriod}</span>
              </div>
              <p className="pc__best-for">
                <span className="pc__best-for-prefix">Cocok untuk:</span> {tier.bestFor}
              </p>
              <ul className="pc__features">
                {tier.features.map((f) => (
                  <li key={f} className="pc__feature">
                    <svg className="pc__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={tier.cta.href} className={`pc__cta pc__cta--${tier.style}`}>{tier.cta.text}</Link>
              <p className="pc__note">Tidak ada biaya tersembunyi</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
