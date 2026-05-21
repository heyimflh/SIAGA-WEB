import { MapPin, Calendar, Building2 } from 'lucide-react';
import { getStatusBadgeVisual, formatTanggalIndonesia, formatCompactRupiah } from '../../project-logic.js';
import './ProjectHero.css';

export default function ProjectHero({ project, derivedStatus, role, hasBid, heroCTA, onCTAClick }) {
 const badge = getStatusBadgeVisual(derivedStatus);

 return (
 <div className="pd-hero">
 <div className="pd-hero__bg-pattern" aria-hidden="true" />
 <div className="pd-hero__content">
 <div className="pd-hero__left">
 <div className="pd-hero__badges">
 <span
 className={`pd-hero__status-badge ${badge.cssClass}`}
 style={{ '--badge-color': badge.color }}
 aria-label={`Status: ${badge.label}`}
 >
 {badge.label}
 </span>
 <span className="pd-hero__infra-badge">
 <Building2 size={14} />
 {project.jenis_infrastruktur}
 </span>
 </div>

 <h1 className="pd-hero__title">{project.nama}</h1>

 <div className="pd-hero__meta">
 <span className="pd-hero__meta-item">
 <MapPin size={16} />
 {project.lokasi.kota}, {project.lokasi.provinsi}
 </span>
 <span className="pd-hero__meta-item">
 <Calendar size={16} />
 Deadline: {formatTanggalIndonesia(project.deadline)}
 </span>
 </div>

 {role === 'client' && (
 <div className="pd-hero__contract">
 <span className="pd-hero__contract-label">Nilai Kontrak</span>
 <span className="pd-hero__contract-value">{formatCompactRupiah(project.nilai_kontrak)}</span>
 </div>
 )}

 <button
 className={`pd-hero__cta ${heroCTA.disabled ? 'pd-hero__cta--disabled' : ''}`}
 onClick={onCTAClick}
 disabled={heroCTA.disabled}
 >
 {heroCTA.label}
 </button>
 </div>
 </div>
 </div>
 );
}
