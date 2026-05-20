import { useEffect, useRef } from 'react';
import { X, ShieldCheck, Star, MapPin, Briefcase } from 'lucide-react';
import './PilotProfileDrawer.css';

export default function PilotProfileDrawer({ pilot, onClose }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    drawerRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!pilot) return null;

  return (
    <div className="pd-drawer-overlay" onClick={onClose}>
      <aside
        className="pd-drawer"
        ref={drawerRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Profil ${pilot.pilot_nama}`}
      >
        <button className="pd-drawer__close" onClick={onClose} aria-label="Tutup">
          <X size={20} />
        </button>

        <div className="pd-drawer__hero">
          <div className="pd-drawer__avatar">
            {pilot.pilot_avatar ? (
              <img src={pilot.pilot_avatar} alt={pilot.pilot_nama} />
            ) : (
              <span>{pilot.pilot_nama.charAt(0)}</span>
            )}
          </div>
          <h3 className="pd-drawer__name">{pilot.pilot_nama}</h3>
          {pilot.pilot_verified && (
            <span className="pd-drawer__verified"><ShieldCheck size={16} /> SIAGA Verified</span>
          )}
        </div>

        <div className="pd-drawer__stats">
          <div className="pd-drawer__stat">
            <Star size={16} />
            <span>{pilot.pilot_rating} Rating</span>
          </div>
          <div className="pd-drawer__stat">
            <Briefcase size={16} />
            <span>{pilot.drone_type}</span>
          </div>
          <div className="pd-drawer__stat">
            <MapPin size={16} />
            <span>Indonesia</span>
          </div>
        </div>

        {pilot.catatan && (
          <div className="pd-drawer__notes">
            <span className="pd-drawer__notes-label">Catatan</span>
            <p>{pilot.catatan}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
