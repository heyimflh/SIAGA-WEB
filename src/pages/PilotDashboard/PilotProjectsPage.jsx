/**
 * PilotProjectsPage — Full page view for route `/dashboard/pilot/projects`.
 *
 * Displays active projects with progress bars, milestones, and deadlines.
 * Feature: pilot-dashboard
 */

import { mockData } from './mock-data.js';
import PilotDashboardShell from './shell/PilotDashboardShell.jsx';
import {
  Rocket,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './PilotProjectsPage.css';

function getMilestoneIcon(status) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 size={16} className="milestone-icon milestone-icon--completed" />;
    case 'in_progress':
      return <Clock size={16} className="milestone-icon milestone-icon--active" />;
    default:
      return <Circle size={16} className="milestone-icon milestone-icon--upcoming" />;
  }
}

function getDaysRemaining(deadline) {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function PilotProjectsPage() {
  const projects = mockData.proyek_berjalan;

  return (
    <div className="pilot-projects-page">
      <PilotDashboardShell
        pilotProfile={mockData.pilot_profile}
        notifUnread={mockData.notifications.unread_count}
        activeMissionCount={projects.length}
      >
        {/* Page Header */}
        <div className="projects-page__header">
          <div className="projects-page__title-row">
            <Rocket size={28} className="projects-page__icon" />
            <div>
              <h1 className="projects-page__title">Proyek Aktif</h1>
              <p className="projects-page__subtitle">
                {projects.length} proyek sedang berjalan
              </p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-page__grid">
          {projects.map((project) => {
            const daysLeft = getDaysRemaining(project.deadline);
            const isUrgent = daysLeft <= 3;

            return (
              <div key={project.id} className="project-card">
                {/* Card Header */}
                <div className="project-card__header">
                  <div className="project-card__title-section">
                    <h3 className="project-card__name">{project.nama_proyek}</h3>
                    <span className="project-card__infra-type">{project.jenis_infrastruktur}</span>
                  </div>
                  <Link
                    to={`/project/${project.id}`}
                    className="project-card__link"
                    title="Lihat detail proyek"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>

                {/* Meta Info */}
                <div className="project-card__meta">
                  <span className="project-card__meta-item">
                    <MapPin size={14} />
                    {project.lokasi}
                  </span>
                  <span className="project-card__meta-item">
                    <User size={14} />
                    {project.client_nama}
                  </span>
                  <span className={`project-card__meta-item project-card__deadline ${isUrgent ? 'project-card__deadline--urgent' : ''}`}>
                    <Calendar size={14} />
                    {daysLeft > 0 ? `${daysLeft} hari tersisa` : 'Overdue'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="project-card__progress">
                  <div className="project-card__progress-header">
                    <span className="project-card__progress-label">Progress</span>
                    <span className="project-card__progress-value">{project.progress_percentage}%</span>
                  </div>
                  <div className="project-card__progress-bar">
                    <div
                      className="project-card__progress-fill"
                      style={{ width: `${project.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Mission Status */}
                <div className="project-card__status-badge">
                  <Clock size={14} />
                  {project.mission_status}
                </div>

                {/* Milestones */}
                <div className="project-card__milestones">
                  <h4 className="project-card__milestones-title">Milestones</h4>
                  <div className="project-card__milestones-list">
                    {project.milestones.map((ms) => (
                      <div
                        key={ms.key}
                        className={`milestone-item milestone-item--${ms.status}`}
                      >
                        {getMilestoneIcon(ms.status)}
                        <span className="milestone-item__label">{ms.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PilotDashboardShell>
    </div>
  );
}

export default PilotProjectsPage;
