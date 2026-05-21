/**
 * ProjectTimeline — Section C (timeline horizontal 5 milestone).
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates implementation
 *
 * Props:
 * - projects: ReadonlyArray<{ id, nama, milestones }>
 * - selectedProjectId: string | null
 * - onSelectProject: (id: string) => void
 *
 * Behavior:
 * - Renders horizontal timeline with 5 milestones for the selected project.
 * - Re-renders full timeline when selectedProjectId changes.
 * - Empty state when proyek_aktif is empty.
 */

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

/**
 * Konstanta MILESTONES — 5 milestone dengan icon Lucide.
 * Urutan posted → bidding_open → pilot_selected →
 * inspection_in_progress → report_ready.
 */
const MILESTONES = [
 { key: 'posted', label: 'Posted', icon: Send },
 { key: 'bidding_open', label: 'Bidding Open', icon: Megaphone },
 { key: 'pilot_selected', label: 'Pilot Selected', icon: UserCheck },
 { key: 'inspection_in_progress', label: 'Inspection In Progress', icon: PlaneTakeoff },
 { key: 'report_ready', label: 'Report Ready', icon: FileCheck2 },
];

/**
 * @param {{
 * projects: ReadonlyArray<{ id: string, nama: string, milestones: Record<string, { status: string, date: string }> }>,
 * selectedProjectId: string | null,
 * onSelectProject: (id: string) => void
 * }} props
 */
function ProjectTimeline({ projects, selectedProjectId, onSelectProject }) {
 // Empty state: jika proyek_aktif kosong
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

 // Find the selected project
 const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

 return (
 <section className="project-timeline" aria-label="Timeline proyek">
 {/* Project Selector */}
 <ProjectSelector
 projects={projects}
 selectedProjectId={selectedProjectId}
 onSelectProject={onSelectProject}
 />

 {/* Timeline horizontal */}
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
