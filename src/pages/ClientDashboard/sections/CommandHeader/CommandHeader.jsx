/**
 * CommandHeader — Premium command center greeting section.
 *
 * Displays a large greeting with company name, descriptive subtitle,
 * project selector tabs, and a system status badge.
 *
 * Props:
 * companyName: string — resolved company name
 * projects: Array<{ id, nama }> — active projects for tab display
 * selectedProjectId: string | null — currently selected project
 * onSelectProject: (id: string) => void — project selection handler
 */

import './CommandHeader.css';

function CommandHeader({ companyName, projects = [], selectedProjectId, onSelectProject }) {
 return (
 <section className="command-header" aria-label="Command center header">
 {/* Top row: Greeting + Status */}
 <div className="command-header__top">
 <h1 className="command-header__greeting">
 Halo, <span className="command-header__greeting-accent">{companyName}</span>
 </h1>
 <div className="command-header__status" aria-label="Status sistem">
 <span className="command-header__status-dot" aria-hidden="true" />
 <span>System Online</span>
 </div>
 </div>

 {/* Subtitle */}
 <p className="command-header__subtitle">
 Command center inspeksi aerial perusahaan Anda. Pantau proyek, aset, bidding pilot, dan aktivitas inspeksi secara real-time.
 </p>

 {/* Project Tabs */}
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
