import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Calendar, User, Shield, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import './StepPilihProyek.css';

function StepPilihProyek({ projects, selectedProject, onSelect, onNext, canProceed, projectImages, inspectionData }) {
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const dropdownRef = useRef(null);

 useEffect(() => {
 function handleClickOutside(e) {
 if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
 setDropdownOpen(false);
 }
 }
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 useEffect(() => {
 function handleEscape(e) {
 if (e.key === 'Escape') setDropdownOpen(false);
 }
 if (dropdownOpen) {
 document.addEventListener('keydown', handleEscape);
 return () => document.removeEventListener('keydown', handleEscape);
 }
 }, [dropdownOpen]);

 const handleSelect = (project) => {
 onSelect(project);
 setDropdownOpen(false);
 };

 const handleKeyDown = (e, project) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 handleSelect(project);
 }
 };

 const getPilotName = (project) => {
 if (!project.bids || project.bids.length === 0) return 'N/A';
 const selected = project.bids.find((b) => b.catatan?.includes('terpilih') || b.catatan?.includes('Pilot terpilih'));
 return selected ? selected.pilot_nama : project.bids[0].pilot_nama;
 };

 const getCompletionDate = (project) => {
 if (!project.milestones) return 'N/A';
 const reportReady = project.milestones.find((m) => m.label === 'Report Ready');
 if (reportReady?.date) {
 return new Date(reportReady.date).toLocaleDateString('id-ID', {
 day: 'numeric', month: 'short', year: 'numeric',
 });
 }
 return 'Completed';
 };

 if (projects.length === 0) {
 return (
 <div className="step-pilih__empty">
 <div className="step-pilih__empty-icon">
 <Shield size={48} />
 </div>
 <h3 className="step-pilih__empty-title">Belum ada proyek yang siap untuk laporan</h3>
 <p className="step-pilih__empty-subtitle">
 Laporan hanya dapat dibuat setelah inspeksi proyek selesai.
 </p>
 </div>
 );
 }

 return (
 <div className="step-pilih">
 <div className="step-pilih__header">
 <span className="step-pilih__step-label">STEP 01</span>
 <h2 className="step-pilih__title">Pilih Proyek Inspeksi</h2>
 <p className="step-pilih__subtitle">
 Pilih proyek completed yang siap dibuatkan laporan inspeksi profesional.
 </p>
 </div>

 <div className="step-pilih__dropdown" ref={dropdownRef}>
 <button
 className={`step-pilih__trigger ${dropdownOpen ? 'step-pilih__trigger--open' : ''}`}
 onClick={() => setDropdownOpen(!dropdownOpen)}
 aria-expanded={dropdownOpen}
 aria-haspopup="listbox"
 type="button"
 >
 <span className="step-pilih__trigger-text">
 {selectedProject ? selectedProject.nama : 'Pilih proyek inspeksi...'}
 </span>
 <ChevronDown
 size={18}
 className={`step-pilih__trigger-icon ${dropdownOpen ? 'step-pilih__trigger-icon--open' : ''}`}
 />
 </button>

 {dropdownOpen && (
 <div className="step-pilih__panel" role="listbox" aria-label="Daftar proyek">
 {projects.map((project) => (
 <div
 key={project.id}
 className={`step-pilih__option ${
 selectedProject?.id === project.id ? 'step-pilih__option--selected' : ''
 }`}
 role="option"
 aria-selected={selectedProject?.id === project.id}
 tabIndex={0}
 onClick={() => handleSelect(project)}
 onKeyDown={(e) => handleKeyDown(e, project)}
 >
 <div className="step-pilih__option-main">
 <span className="step-pilih__option-name">{project.nama}</span>
 <span className="step-pilih__option-badge">{project.jenis_infrastruktur}</span>
 </div>
 <span className="step-pilih__option-location">
 <MapPin size={12} /> {project.lokasi?.kota}, {project.lokasi?.provinsi}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>

 {selectedProject && (
 <div className="step-pilih__preview">
 {projectImages?.coverImage && (
 <div className="step-pilih__cover-image">
 <img
 src={projectImages.coverImage}
 alt={`Foto inspeksi proyek ${selectedProject.nama}`}
 loading="lazy"
 onError={(e) => { e.target.style.display = 'none'; }}
 />
 <div className="step-pilih__cover-overlay">
 <span className="step-pilih__cover-type">{selectedProject.jenis_infrastruktur}</span>
 </div>
 </div>
 )}

 <div className="step-pilih__preview-header">
 <h3 className="step-pilih__preview-title">{selectedProject.nama}</h3>
 <span className="step-pilih__preview-status">
 <CheckCircle size={14} /> Inspection Completed
 </span>
 </div>

 <div className="step-pilih__preview-grid">
 <div className="step-pilih__preview-meta">
 <div className="step-pilih__meta-item">
 <Shield size={14} />
 <span>{selectedProject.jenis_infrastruktur}</span>
 </div>
 <div className="step-pilih__meta-item">
 <MapPin size={14} />
 <span>{selectedProject.lokasi?.kota}, {selectedProject.lokasi?.provinsi}</span>
 </div>
 <div className="step-pilih__meta-item">
 <Calendar size={14} />
 <span>{getCompletionDate(selectedProject)}</span>
 </div>
 <div className="step-pilih__meta-item">
 <User size={14} />
 <span>{getPilotName(selectedProject)}</span>
 </div>
 </div>

 <div className="step-pilih__preview-stats">
 <div className="step-pilih__stat-card step-pilih__stat-card--critical">
 <AlertTriangle size={16} />
 <span className="step-pilih__stat-num">{inspectionData?.criticalFindings ?? selectedProject.jumlah_titik_inspeksi ?? 0}</span>
 <span className="step-pilih__stat-text">Critical Findings</span>
 </div>
 <div className="step-pilih__stat-card step-pilih__stat-card--safe">
 <CheckCircle size={16} />
 <span className="step-pilih__stat-num">{inspectionData?.safePoints ?? selectedProject.deliverables?.length ?? 0}</span>
 <span className="step-pilih__stat-text">Safe Points</span>
 </div>
 <div className="step-pilih__stat-card step-pilih__stat-card--photos">
 <Camera size={16} />
 <span className="step-pilih__stat-num">{inspectionData?.photosCaptured ?? 0}</span>
 <span className="step-pilih__stat-text">Photos</span>
 </div>
 </div>
 </div>


 {projectImages?.mapPreviewImage && (
 <div className="step-pilih__minimap step-pilih__minimap--real">
 <img
 src={projectImages.mapPreviewImage}
 alt={`Peta area inspeksi ${selectedProject.nama}`}
 loading="lazy"
 onError={(e) => { e.target.parentElement.style.display = 'none'; }}
 />
 <span className="step-pilih__minimap-label">
 <MapPin size={10} /> Route Preview — {inspectionData?.coveragePercentage ?? 90}% Coverage
 </span>
 </div>
 )}
 </div>
 )}


 <div className="step-pilih__nav">
 <button
 className="step-pilih__btn-next"
 onClick={onNext}
 disabled={!canProceed}
 type="button"
 >
 Lanjut →
 </button>
 </div>
 </div>
 );
}

export default StepPilihProyek;
