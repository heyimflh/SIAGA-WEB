/**
 * ProyekBerjalan — Active Inspection Missions section.
 * Feature: pilot-dashboard
 * Validates: Requirements 9
 */

import { useNavigate } from 'react-router-dom';
import { getDeadlineCountdown } from '../../utils/formatDate';
import { isDeadlineUrgent } from '../../utils/deadlineUrgency';
import './ProyekBerjalan.css';

function MilestoneTimeline({ milestones }) {
 return (
 <div className="milestone-timeline" aria-label="Timeline milestone proyek">
 {milestones.map((m, i) => (
 <div key={m.key} className={`milestone-timeline__item milestone-timeline__item--${m.status}`}>
 <div className="milestone-timeline__dot" aria-hidden="true" />
 {i < milestones.length - 1 && <div className="milestone-timeline__line" aria-hidden="true" />}
 <span className="milestone-timeline__label">{m.label}</span>
 </div>
 ))}
 </div>
 );
}

function ProyekCard({ project, onUploadClick, onDetailClick }) {
 const countdown = getDeadlineCountdown(project.deadline);
 const urgent = isDeadlineUrgent(project.deadline);

 return (
 <article className="proyek-card">
 <div className="proyek-card__header">
 <div>
 <span className="proyek-card__infra-badge">{project.jenis_infrastruktur}</span>
 <h4 className="proyek-card__name">{project.nama_proyek}</h4>
 <span className="proyek-card__location">{project.lokasi}</span>
 </div>
 <span className="proyek-card__mission-status">{project.mission_status}</span>
 </div>

 <div className="proyek-card__progress-section">
 <div className="proyek-card__progress-header">
 <span className="proyek-card__client">Client: {project.client_nama}</span>
 <span className={`proyek-card__deadline ${urgent ? 'proyek-card__deadline--urgent' : ''}`}>
 {countdown}
 </span>
 </div>
 <div className="proyek-card__progress-bar" role="progressbar" aria-valuenow={project.progress_percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress ${project.progress_percentage}%`}>
 <div className="proyek-card__progress-fill" style={{ width: `${project.progress_percentage}%` }} />
 </div>
 <span className="proyek-card__progress-text">{project.progress_percentage}% selesai</span>
 </div>

 <MilestoneTimeline milestones={project.milestones} />

 <div className="proyek-card__actions">
 <button type="button" className="proyek-card__btn proyek-card__btn--primary" onClick={() => onUploadClick(project.id)}>
 Upload Hasil
 </button>
 <button type="button" className="proyek-card__btn proyek-card__btn--secondary" onClick={() => onDetailClick(project.id)}>
 Lihat Detail
 </button>
 </div>
 </article>
 );
}

function ProyekBerjalan({ projects, onUploadClick, onDetailClick }) {
 const navigate = useNavigate();

 const handleDetail = (projectId) => {
 navigate(`/project/${projectId}`);
 };

 return (
 <section className="proyek-berjalan" id="section-misi" aria-label="Misi Inspeksi Aktif">
 <div className="proyek-berjalan__header">
 <span className="proyek-berjalan__label">ACTIVE MISSIONS</span>
 <h3 className="proyek-berjalan__title">Misi Inspeksi Aktif</h3>
 <p className="proyek-berjalan__subtitle">Pantau progress inspeksi, milestone, dan deadline proyek yang sedang Anda kerjakan.</p>
 </div>

 {projects.length === 0 ? (
 <div className="proyek-berjalan__empty">
 <p>Belum ada proyek berjalan</p>
 </div>
 ) : (
 <div className="proyek-berjalan__grid">
 {projects.map((p) => (
 <ProyekCard
 key={p.id}
 project={p}
 onUploadClick={onUploadClick}
 onDetailClick={handleDetail}
 />
 ))}
 </div>
 )}
 </section>
 );
}

export default ProyekBerjalan;
