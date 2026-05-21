import { Building2, Maximize2, Target, FileText } from 'lucide-react';
import './ProjectScope.css';

export default function ProjectScope({ project }) {
 return (
 <div className="pd-scope">
 <h2 className="pd-scope__title">Mission Scope</h2>
 <p className="pd-scope__subtitle">Scope pekerjaan, deliverables, dan requirement utama proyek.</p>

 <div className="pd-scope__grid">
 <div className="pd-scope__left">
 <p className="pd-scope__desc">{project.deskripsi}</p>

 <div className="pd-scope__meta-row">
 <div className="pd-scope__meta-item">
 <Building2 size={16} />
 <span>{project.jenis_infrastruktur}</span>
 </div>
 <div className="pd-scope__meta-item">
 <Maximize2 size={16} />
 <span>{project.luas_area ? `${project.luas_area} km²` : '-'}</span>
 </div>
 <div className="pd-scope__meta-item">
 <Target size={16} />
 <span>{project.jumlah_titik_inspeksi} titik inspeksi</span>
 </div>
 </div>

 {project.deliverables && project.deliverables.length > 0 && (
 <div className="pd-scope__deliverables">
 <span className="pd-scope__section-label">Deliverables</span>
 <div className="pd-scope__chips">
 {project.deliverables.map((d) => (
 <span key={d} className="pd-scope__chip">
 <FileText size={12} /> {d}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>

 {project.spesifikasi_teknis && (
 <div className="pd-scope__right">
 <span className="pd-scope__section-label">Key Requirements</span>
 <ul className="pd-scope__requirements">
 <li><strong>Resolusi:</strong> {project.spesifikasi_teknis.resolusi_foto}</li>
 <li><strong>Format:</strong> {project.spesifikasi_teknis.format_output}</li>
 <li><strong>Peralatan:</strong> {project.spesifikasi_teknis.peralatan_minimum}</li>
 </ul>
 </div>
 )}
 </div>
 </div>
 );
}
