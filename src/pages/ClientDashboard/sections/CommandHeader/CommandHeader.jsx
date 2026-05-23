import './CommandHeader.css';

function CommandHeader({ companyName, projects = [], selectedProjectId, onSelectProject }) {
 return (
 <section className="command-header" aria-label="Command center header">
 <div className="command-header__top">
 <h1 className="command-header__greeting">
 Halo, <span className="command-header__greeting-accent">{companyName}</span>
 </h1>
 <div className="command-header__status" aria-label="Status sistem">
 <span className="command-header__status-dot" aria-hidden="true" />
 <span>System Online</span>
 </div>
 </div>


 <p className="command-header__subtitle">
 Command center inspeksi aerial perusahaan Anda. Pantau proyek, aset, bidding pilot, dan aktivitas inspeksi secara real-time.
 </p>

 {projects.length > 0 && (
 <div className="command-header__tabs" role="tablist" aria-label="Pilih proyek">
 {projects.map((project) => (
 <button
 key={project.id}
 type="button"
 role="tab"
 className={`command-header__tab${selectedProjectId === project.id ? ' command-header__tab--active' : ''}`}
 aria-selected={selectedProjectId === project.id}
 onClick={() => onSelectProject(project.id)}
 >
 {project.nama}
 </button>
 ))}
 </div>
 )}
 </section>
 );
}

export default CommandHeader;
