import { useRef } from 'react';
import { Star, MapPin, CheckCircle, Briefcase, Clock, Navigation } from 'lucide-react';
import './PilotCard.css';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function PilotCard({ pilot, searchQuery, authRole, onViewProfile, onInvite }) {
  const btnRef = useRef(null);

  const inviteDisabled = authRole !== 'client';
  const inviteTooltip = !authRole
    ? 'Login untuk mengundang pilot.'
    : authRole === 'pilot'
    ? 'Hanya Client yang dapat mengundang pilot.'
    : '';

  return (
    <article className="pilot-card">
      {/* Identity */}
      <div className="pilot-card__identity">
        <div className={`pilot-card__avatar ${pilot.siaga_verified ? 'pilot-card__avatar--verified' : ''}`}>
          {pilot.avatar ? (
            <img src={pilot.avatar} alt={pilot.name} loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          ) : null}
          <span className="pilot-card__initials" style={{ display: pilot.avatar ? 'none' : 'flex' }}>
            {getInitials(pilot.name)}
          </span>
        </div>
        <div className="pilot-card__info">
          <div className="pilot-card__name-row">
            <h3 className="pilot-card__name">{pilot.name}</h3>
            {pilot.siaga_verified && (
              <CheckCircle size={16} className="pilot-card__verified-icon" />
            )}
          </div>
          <div className="pilot-card__location">
            <MapPin size={12} />
            <span>{pilot.city}, {pilot.province}</span>
          </div>
          <div className="pilot-card__rating">
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>{pilot.rating.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      {pilot.trust_badges && pilot.trust_badges.length > 0 && (
        <div className="pilot-card__trust">
          {pilot.trust_badges.slice(0, 3).map((badge) => (
            <span key={badge} className="pilot-card__badge">{badge}</span>
          ))}
        </div>
      )}

      {/* Specializations */}
      <div className="pilot-card__specs">
        {pilot.specializations.slice(0, 3).map((spec) => (
          <span key={spec} className="pilot-card__spec">{spec}</span>
        ))}
      </div>

      {/* Bio */}
      {pilot.bio && (
        <p className="pilot-card__bio">{pilot.bio}</p>
      )}

      {/* Stats */}
      <div className="pilot-card__stats">
        <span className="pilot-card__stat">
          <Briefcase size={12} /> {pilot.projects_completed} Proyek
        </span>
        <span className="pilot-card__stat">
          <Clock size={12} /> {pilot.response_rate}
        </span>
        <span className="pilot-card__stat">
          <Navigation size={12} /> {pilot.drone_type}
        </span>
      </div>

      {/* Portfolio Thumbnails */}
      {pilot.portfolio_images && pilot.portfolio_images.length > 0 && (
        <div className="pilot-card__portfolio">
          {pilot.portfolio_images.slice(0, 3).map((img, i) => {
            const src = typeof img === 'string' ? img : img.src;
            const alt = typeof img === 'string' ? 'Portfolio' : img.alt;
            return (
              <img key={i} src={src} alt={alt} loading="lazy" className="pilot-card__thumb" />
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="pilot-card__actions">
        <button
          ref={btnRef}
          className="pilot-card__btn pilot-card__btn--outline"
          onClick={() => onViewProfile(pilot, btnRef.current)}
        >
          Lihat Profil
        </button>
        <button
          className={`pilot-card__btn pilot-card__btn--primary ${inviteDisabled ? 'pilot-card__btn--disabled' : ''}`}
          onClick={() => !inviteDisabled && onInvite(pilot)}
          aria-disabled={inviteDisabled}
          title={inviteTooltip}
        >
          Invite to Project
        </button>
      </div>
    </article>
  );
}
