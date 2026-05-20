import { useEffect, useRef } from 'react';
import { X, Star, MapPin, CheckCircle, Briefcase, Clock, Shield, Calendar } from 'lucide-react';
import './PilotProfileDrawer.css';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function PilotProfileDrawer({ pilot, isOpen, onClose, onHire, onGalleryClick, authRole }) {
  const drawerRef = useRef(null);
  const nameId = 'drawer-pilot-name';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !pilot) return null;

  const hireDisabled = authRole !== 'client';
  const hireTooltip = !authRole
    ? 'Login untuk mengundang pilot.'
    : authRole === 'pilot'
    ? 'Hanya Client yang dapat mengundang pilot.'
    : '';

  const portfolioImages = (pilot.portfolio_images || []).filter((img) => {
    const src = typeof img === 'string' ? img : img?.src;
    return !!src;
  });

  return (
    <div className="pilot-drawer-overlay" onClick={onClose}>
      <div
        ref={drawerRef}
        className="pilot-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={nameId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button className="pilot-drawer__close" onClick={onClose} aria-label="Tutup profil">
          <X size={20} />
        </button>

        {/* Cover */}
        <div className="pilot-drawer__cover">
          {pilot.cover_image ? (
            <img src={pilot.cover_image} alt="" className="pilot-drawer__cover-img" />
          ) : (
            <div className="pilot-drawer__cover-fallback" />
          )}
          <div className="pilot-drawer__cover-gradient" />
        </div>

        {/* Content */}
        <div className="pilot-drawer__content">
          {/* Identity */}
          <div className="pilot-drawer__identity">
            <div className={`pilot-drawer__avatar ${pilot.siaga_verified ? 'pilot-drawer__avatar--verified' : ''}`}>
              {pilot.avatar ? (
                <img src={pilot.avatar} alt={pilot.name} />
              ) : (
                <span className="pilot-drawer__initials">{getInitials(pilot.name)}</span>
              )}
            </div>
            <div>
              <div className="pilot-drawer__name-row">
                <h2 id={nameId} className="pilot-drawer__name">{pilot.name}</h2>
                {pilot.siaga_verified && <CheckCircle size={18} className="pilot-drawer__verified" />}
              </div>
              <div className="pilot-drawer__meta">
                <MapPin size={13} />
                <span>{pilot.city}, {pilot.province}</span>
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span className="pilot-drawer__rating-val">{pilot.rating.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="pilot-drawer__trust-strip">
            <div className="pilot-drawer__trust-item">
              <Briefcase size={14} />
              <span>{pilot.projects_completed} Proyek</span>
            </div>
            <div className="pilot-drawer__trust-item">
              <Clock size={14} />
              <span>{pilot.response_rate} Response</span>
            </div>
            <div className="pilot-drawer__trust-item">
              <Shield size={14} />
              <span>{pilot.siaga_verified ? 'SIDOPI Active' : 'Belum Verified'}</span>
            </div>
            <div className="pilot-drawer__trust-item">
              <Calendar size={14} />
              <span>Sejak {pilot.member_since}</span>
            </div>
          </div>

          {/* Overview */}
          <section className="pilot-drawer__section">
            <h4>Overview</h4>
            <p className="pilot-drawer__bio">{pilot.bio}</p>
            <div className="pilot-drawer__specs">
              {pilot.specializations.map((s) => (
                <span key={s} className="pilot-drawer__spec-chip">{s}</span>
              ))}
            </div>
            {pilot.area_operasi && pilot.area_operasi.length > 0 && (
              <p className="pilot-drawer__area">
                <MapPin size={12} /> Area operasi: {pilot.area_operasi.join(', ')}
              </p>
            )}
          </section>

          {/* Equipment */}
          {pilot.drones && pilot.drones.length > 0 && (
            <section className="pilot-drawer__section">
              <h4>Equipment</h4>
              <div className="pilot-drawer__drones">
                {pilot.drones.map((d) => (
                  <div key={d.name} className="pilot-drawer__drone-card">
                    <span className="pilot-drawer__drone-name">{d.name}</span>
                    {d.use_case && <span className="pilot-drawer__drone-use">{d.use_case}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {pilot.certifications && pilot.certifications.length > 0 && (
            <section className="pilot-drawer__section">
              <h4>Sertifikasi</h4>
              <div className="pilot-drawer__certs">
                {pilot.certifications.map((c) => (
                  <div key={c.name} className="pilot-drawer__cert">
                    <Shield size={14} style={{ color: c.badge_color }} />
                    <div>
                      <span className="pilot-drawer__cert-name">{c.name}</span>
                      <span className="pilot-drawer__cert-date">
                        Berlaku hingga {c.expiry_date}
                      </span>
                    </div>
                    {c.status && (
                      <span className={`pilot-drawer__cert-status pilot-drawer__cert-status--${c.status}`}>
                        {c.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Portfolio */}
          {portfolioImages.length > 0 && (
            <section className="pilot-drawer__section">
              <h4>Portofolio</h4>
              <div className="pilot-drawer__gallery">
                {portfolioImages.map((img, i) => {
                  const src = typeof img === 'string' ? img : img.src;
                  const alt = typeof img === 'string' ? 'Portfolio' : img.alt;
                  return (
                    <img
                      key={i}
                      src={src}
                      alt={alt}
                      loading="lazy"
                      className="pilot-drawer__gallery-img"
                      onClick={() => onGalleryClick(portfolioImages, i)}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Reviews */}
          {pilot.reviews && pilot.reviews.length > 0 && (
            <section className="pilot-drawer__section">
              <h4>Review</h4>
              <div className="pilot-drawer__reviews">
                {pilot.reviews.slice(0, 3).map((r, i) => (
                  <div key={i} className="pilot-drawer__review">
                    <div className="pilot-drawer__review-header">
                      <span className="pilot-drawer__review-name">{r.reviewer_name}</span>
                      <span className="pilot-drawer__review-rating">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" /> {r.rating}
                      </span>
                    </div>
                    <p className="pilot-drawer__review-text">{r.text}</p>
                    <span className="pilot-drawer__review-date">{r.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky CTA */}
        <div className="pilot-drawer__cta">
          <button
            className={`pilot-drawer__hire-btn ${hireDisabled ? 'pilot-drawer__hire-btn--disabled' : ''}`}
            onClick={() => !hireDisabled && onHire()}
            aria-disabled={hireDisabled}
            title={hireTooltip}
          >
            Hire This Pilot
          </button>
        </div>
      </div>
    </div>
  );
}
