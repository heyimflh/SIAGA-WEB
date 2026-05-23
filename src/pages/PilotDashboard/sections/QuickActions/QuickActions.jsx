import { useNavigate } from 'react-router-dom';
import { Search, Upload, User } from 'lucide-react';
import './QuickActions.css';

const ACTIONS = [
 {
 id: 'find-project',
 icon: Search,
 label: 'Cari Proyek Baru',
 desc: 'Temukan proyek inspeksi baru di Job Radar',
 action: 'navigate',
 to: '/dashboard/pilot/job-radar',
 },
 {
 id: 'upload-file',
 icon: Upload,
 label: 'Upload File',
 desc: 'Upload data inspeksi ke workspace',
 action: 'scroll',
 target: 'section-workspace',
 },
 {
 id: 'view-profile',
 icon: User,
 label: 'Lihat Profil Saya',
 desc: 'Lihat profil publik Anda di platform',
 action: 'navigate',
 to: '/pilots',
 },
];

function QuickActions({ onScrollToWorkspace }) {
 const navigate = useNavigate();

 const handleClick = (action) => {
 if (action.action === 'navigate') {
 navigate(action.to);
 } else if (action.action === 'scroll') {
 onScrollToWorkspace();
 }
 };

 return (
 <section className="quick-actions" id="section-aksi" aria-label="Aksi Cepat Misi">
 <h3 className="quick-actions__title">Aksi Cepat Misi</h3>
 <div className="quick-actions__grid">
 {ACTIONS.map((a) => {
 const IconComp = a.icon;
 return (
 <button
 key={a.id}
 type="button"
 className="quick-actions__card"
 onClick={() => handleClick(a)}
 >
 <div className="quick-actions__icon-wrap">
 <IconComp size={24} aria-hidden="true" />
 </div>
 <span className="quick-actions__label">{a.label}</span>
 <span className="quick-actions__desc">{a.desc}</span>
 </button>
 );
 })}
 </div>
 </section>
 );
}

export default QuickActions;
