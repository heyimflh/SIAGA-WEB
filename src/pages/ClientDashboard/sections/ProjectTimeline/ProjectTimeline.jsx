import { Link } from 'react-router-dom';
import {
 Send,
 Megaphone,
 UserCheck,
 PlaneTakeoff,
 FileCheck2,
 FolderKanban,
} from 'lucide-react';
import ProjectSelector from './ProjectSelector';
import MilestoneNode from './MilestoneNode';
import './ProjectTimeline.css';

const MILESTONES = [
 { key: 'posted', label: 'Posted', icon: Send },
 { key: 'bidding_open', label: 'Bidding Open', icon: Megaphone },
 { key: 'pilot_selected', label: 'Pilot Selected', icon: UserCheck },
 { key: 'inspection_in_progress', label: 'Inspection In Progress', icon: PlaneTakeoff },
 { key: 'report_ready', label: 'Report Ready', icon: FileCheck2 },
];

function ProjectTimeline({ projects, selectedProjectId, onSelectProject }) {

 if (!projects || projects.length === 0) {
 return (
 <section className="project-timeline project-timeline--empty" aria-label="Timeline proyek">
 <div className="project-timeline__empty-state">
 <FolderKanban size={48} className="project-timeline__empty-icon" aria-hidden="true" />
 <p className="project-timeline__empty-text">Belum ada proyek aktif</p>
 <Link
 to="/dashboard/client/create-project"
 className="project-timeline__empty-cta"
 >
 Buat Proyek Baru
 </Link>
 </div>
 </section>
 );
 }


 const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

 return (
 <section className="project-timeline" aria-label="Timeline proyek">

 <ProjectSelector
 projects={projects}
 selectedProjectId={selectedProjectId}
 onSelectProject={onSelectProject}
 />

 <div
 className="project-timeline__track"
 role="tabpanel"
 id={`project-panel-${selectedProject.id}`}
 aria-labelledby={`project-tab-${selectedProject.id}`}
 >
 <ol className="project-timeline__milestones" role="list">
 {MILESTONES.map((milestone, idx) => {
 const nodeData = selectedProject.milestones[milestone.key] || {
 status: 'upcoming',
 date: '',
 };
 return (
 <MilestoneNode
 key={milestone.key}
 milestoneKey={milestone.key}
 label={milestone.label}
 icon={milestone.icon}
 status={nodeData.status}
 date={nodeData.date}
 isLast={idx === MILESTONES.length - 1}
 />
 );
 })}
 </ol>
 </div>
 </section>
 );
}

export default ProjectTimeline;
