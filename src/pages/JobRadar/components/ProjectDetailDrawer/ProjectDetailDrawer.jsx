import { useEffect, useRef } from 'react';
import { X, MapPin, Building2, FileText, Zap } from 'lucide-react';
import { formatRupiah, getStatusVisual } from '../../filters.js';
import './ProjectDetailDrawer.css';

/**
 * ProjectDetailDrawer — Right-side drawer (desktop) or bottom sheet (mobile)
 * showing full project details.
 */
export default function ProjectDetailDrawer({ project, isOpen, onClose, onBidClick, isMobile }) {
  const drawerRef = useRef(null);

  // Focus management & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the drawer
    if (drawerRef.current) {
      drawerRef.current.focus();
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const statusVisual = getStatusVisual(project.status);
  const deadlineDate = new Date(project.deadline);
  const deadlineStr = deadlineDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const drawerClasses = [
    'detail-drawer',
    isMobile && 'detail-drawer--mobile',
    isOpen && 'detail-drawer--open',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Overlay */}
      <div
        className={`detail-drawer-overlay ${isOpen ? 'detail-drawer-overlay--visible' : ''}`}
        onClick={onClose}
      />

      <div
        className={drawerClasses}
        ref={drawerRef}
        role="dialog"
        aria-labelledby="detail-drawer-title"
        aria-modal="true"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="detail-drawer__header">
          <button
            className="detail-drawer__close"
            onClick={onClose}
            aria-label="Tutup detail proyek"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="detail-drawer__content">
          {/* Status */}
          <div className="detail-drawer__status-row">
            <span
              className="detail-drawer__status"
              style={{ color: statusVisual.color, borderColor: statusVisual.color + '44' }}
            >
              {statusVisual.pulse && <span className="detail-drawer__status-dot" style={{ background: statusVisual.color }} />}
              {statusVisual.label}
            </span>
            <span className="detail-drawer__infra">{project.jenis_infrastruktur}</span>
          </div>

          {/* Name */}
          <h2 className="detail-drawer__name" id="detail-drawer-title">{project.nama}</h2>

          {/* Location */}
          <div className="detail-drawer__info-row">
            <MapPin size={14} className="detail-drawer__info-icon" />
            <span>{project.lokasi.kota}, {project.lokasi.provinsi}</span>
          </div>

          {/* Client */}
          {project.client_nama && (
            <div className="detail-drawer__info-row">
              <Building2 size={14} className="detail-drawer__info-icon" />
              <span>{project.client_nama}</span>
            </div>
          )}

          {/* Stats Grid */}
          <div className="detail-drawer__stats">
            <div className="detail-drawer__stat-card">
              <span className="detail-drawer__stat-label">Nilai Kontrak</span>
              <span className="detail-drawer__stat-value detail-drawer__stat-value--cyan">
                {formatRupiah(project.nilai_kontrak)}
              </span>
            </div>
            <div className="detail-drawer__stat-card">
              <span className="detail-drawer__stat-label">Deadline</span>
              <span className="detail-drawer__stat-value">{deadlineStr}</span>
            </div>
            <div className="detail-drawer__stat-card">
              <span className="detail-drawer__stat-label">Bidder Aktif</span>
              <span className="detail-drawer__stat-value">{project.jumlah_bidder} pilot</span>
            </div>
          </div>

          {/* Description */}
          {project.deskripsi && (
            <div className="detail-drawer__description">
              <div className="detail-drawer__desc-header">
                <FileText size={14} />
                <span>Deskripsi Proyek</span>
              </div>
              <p className="detail-drawer__desc-text">{project.deskripsi}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="detail-drawer__footer">
          <button
            className="detail-drawer__bid-btn"
            onClick={onBidClick}
            aria-label={`Bid proyek ${project.nama}`}
          >
            <Zap size={16} />
            Bid Sekarang
          </button>
          <button
            className="detail-drawer__close-btn"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}
