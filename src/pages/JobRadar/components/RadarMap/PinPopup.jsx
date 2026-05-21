import { X, MapPin, Clock, Users, Eye, Zap } from 'lucide-react';
import { formatCompactRupiah, getStatusVisual } from '../../filters.js';
import './PinPopup.css';

/**
 * PinPopup — Glassmorphism mission preview card that appears after flyTo.
 */
export default function PinPopup({ project, onClose, onBidClick, onDetailClick }) {
 if (!project) return null;

 const statusVisual = getStatusVisual(project.status);
 const deadlineDate = new Date(project.deadline);
 const deadlineStr = deadlineDate.toLocaleDateString('id-ID', {
 day: 'numeric',
 month: 'short',
 year: 'numeric',
 });

 return (
 <div
 className="pin-popup"
 role="dialog"
 aria-labelledby="pin-popup-title"
 aria-modal="false"
 >
 <div className="pin-popup__card">
 {/* Close button */}
 <button
 className="pin-popup__close"
 onClick={onClose}
 aria-label="Tutup popup"
 >
 <X size={14} />
 </button>

 {/* Status + Infra */}
 <div className="pin-popup__top">
 <span
 className="pin-popup__status"
 style={{ color: statusVisual.color }}
 >
 {statusVisual.pulse && <span className="pin-popup__status-dot" style={{ background: statusVisual.color }} />}
 {statusVisual.label}
 </span>
 <span className="pin-popup__infra">{project.jenis_infrastruktur}</span>
 </div>

 {/* Name */}
 <h3 className="pin-popup__name" id="pin-popup-title">{project.nama}</h3>

 {/* Location */}
 <div className="pin-popup__location">
 <MapPin size={11} />
 <span>{project.lokasi.kota}, {project.lokasi.provinsi}</span>
 </div>

 {/* Meta */}
 <div className="pin-popup__meta">
 <span className="pin-popup__value">{formatCompactRupiah(project.nilai_kontrak)}</span>
 <span className="pin-popup__meta-item">
 <Clock size={10} /> {deadlineStr}
 </span>
 <span className="pin-popup__meta-item">
 <Users size={10} /> {project.jumlah_bidder} bidder
 </span>
 </div>

 {/* Actions */}
 <div className="pin-popup__actions">
 <button
 className="pin-popup__btn pin-popup__btn--detail"
 onClick={(e) => { e.stopPropagation(); onDetailClick(project); }}
 >
 <Eye size={12} /> Lihat Detail
 </button>
 <button
 className="pin-popup__btn pin-popup__btn--bid"
 onClick={(e) => { e.stopPropagation(); onBidClick(); }}
 >
 <Zap size={12} /> Bid Sekarang
 </button>
 </div>
 </div>
 </div>
 );
}
