import { trustBadges } from '../data/trust-badges-data';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import './SecurityTrustBadges.css';

const iconMap = {
  Shield: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  BadgeCheck: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/><path d="m9 12 2 2 4-4"/></svg>,
  Lock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Star: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Activity: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

export default function SecurityTrustBadges() {
  return (
    <section className="stb" id="security">
      <div className="stb__container">
        <SupportingSectionHeader
          eyebrow="SECURITY"
          title="Keamanan dan Kepercayaan Platform"
          subtitle="SIAGA menjaga keamanan data, transaksi, dan reputasi setiap pengguna platform."
        />
        <div className="stb__grid">
          {trustBadges.map((badge) => (
            <div key={badge.id} className="stb__card">
              <div className="stb__icon">{iconMap[badge.icon] || iconMap.Shield}</div>
              <h3 className="stb__label">{badge.label}</h3>
              <p className="stb__desc">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
