import { MapPin, Clock, Users, Eye, Zap } from 'lucide-react';
import { formatCompactRupiah, getStatusVisual } from '../../filters.js';
import './ProjectCard.css';

export default function ProjectCard({
 project,
 isHovered,
 isHighlighted,
 onHover,
 onClick,
 onDetailClick,
 onBidClick,
}) {
 const statusVisual = getStatusVisual(project.status);

 const cardClasses = [
 'mission-card',
 isHovered && 'mission-card--hovered',
 isHighlighted && 'mission-card--highlighted',
 ].filter(Boolean).join(' ');

 const deadlineDate = new Date(project.deadline);
 const deadlineStr = deadlineDate.toLocaleDateString('id-ID', {
 day: 'numeric',
 month: 'short',
 year: 'numeric',
 });

 return (
 <article
 className={cardClasses}
 onMouseEnter={() => onHover(project.id)}
 onMouseLeave={() => onHover(null)}
 onClick={() => onClick(project)}
 role="button"
 tabIndex={0}
 aria-label={`Proyek ${project.nama} di ${project.lokasi.kota}, ${project.lokasi.provinsi}`}
 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(project); } }}
 >
 <div className="mission-card__top">
 <span
 className="mission-card__status"
 style={{ color: statusVisual.color, borderColor: statusVisual.color + '44' }}
 >
 {statusVisual.pulse && <span className="mission-card__status-dot" style={{ background: statusVisual.color }} />}
 {statusVisual.label}
 </span>
 <span className="mission-card__infra">{project.jenis_infrastruktur}</span>
 </div>


 <h3 className="mission-card__name">{project.nama}</h3>

 <div className="mission-card__location">
 <MapPin size={11} />
 <span>{project.lokasi.kota}, {project.lokasi.provinsi}</span>
 </div>

 <div className="mission-card__meta">
 <div className="mission-card__value">
 {formatCompactRupiah(project.nilai_kontrak)}
 </div>
 <div className="mission-card__meta-item">
 <Clock size={10} />
 <span>{deadlineStr}</span>
 </div>
 <div className="mission-card__meta-item">
 <Users size={10} />
 <span>{project.jumlah_bidder} bidder</span>
 </div>
 </div>


 <div className="mission-card__actions">
 <button
 className="mission-card__btn mission-card__btn--detail"
 onClick={(e) => { e.stopPropagation(); onDetailClick(project); }}
 aria-label={`Lihat detail ${project.nama}`}
 >
 <Eye size={12} />
 Lihat Detail
 </button>
 <button
 className="mission-card__btn mission-card__btn--bid"
 onClick={(e) => { e.stopPropagation(); onBidClick(); }}
 aria-label={`Bid proyek ${project.nama}`}
 >
 <Zap size={12} />
 Bid Sekarang
 </button>
 </div>
 </article>
 );
}
