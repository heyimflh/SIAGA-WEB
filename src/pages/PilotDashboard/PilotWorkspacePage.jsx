/**
 * PilotWorkspacePage — Full page view for route `/dashboard/pilot/workspace`.
 *
 * Displays uploaded files grouped by project with upload area.
 * Feature: pilot-dashboard
 */

import { useMemo } from 'react';
import { mockData } from './mock-data.js';
import PilotDashboardShell from './shell/PilotDashboardShell.jsx';
import {
  FolderOpen,
  FileText,
  Image,
  Film,
  Upload,
  HardDrive,
  Calendar,
  Layers,
} from 'lucide-react';
import './PilotWorkspacePage.css';

function formatFileSize(bytes) {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

function getFileIcon(tipe) {
  const t = tipe.toLowerCase();
  if (t.includes('photo') || t.includes('raw') || t.includes('image')) return Image;
  if (t.includes('video') || t.includes('4k') || t.includes('mp4')) return Film;
  return FileText;
}

function PilotWorkspacePage() {
  const files = mockData.workspace_files;
  const projects = mockData.proyek_berjalan;

  // Group files by project
  const groupedFiles = useMemo(() => {
    const groups = {};
    files.forEach((file) => {
      if (!groups[file.project_id]) {
        const project = projects.find((p) => p.id === file.project_id);
        groups[file.project_id] = {
          projectName: project ? project.nama_proyek : 'Proyek Tidak Diketahui',
          files: [],
        };
      }
      groups[file.project_id].files.push(file);
    });
    return groups;
  }, [files, projects]);

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + f.ukuran, 0),
    [files]
  );

  return (
    <div className="pilot-workspace-page">
      <PilotDashboardShell
        pilotProfile={mockData.pilot_profile}
        notifUnread={mockData.notifications.unread_count}
        activeMissionCount={projects.length}
      >
        {/* Page Header */}
        <div className="workspace-page__header">
          <div className="workspace-page__title-row">
            <FolderOpen size={28} className="workspace-page__icon" />
            <div>
              <h1 className="workspace-page__title">Workspace</h1>
              <p className="workspace-page__subtitle">Kelola file inspeksi drone Anda</p>
            </div>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="workspace-page__stats">
          <div className="workspace-stat">
            <Layers size={20} />
            <div className="workspace-stat__info">
              <span className="workspace-stat__value">{files.length}</span>
              <span className="workspace-stat__label">Total File</span>
            </div>
          </div>
          <div className="workspace-stat">
            <HardDrive size={20} />
            <div className="workspace-stat__info">
              <span className="workspace-stat__value">{formatFileSize(totalSize)}</span>
              <span className="workspace-stat__label">Total Ukuran</span>
            </div>
          </div>
          <div className="workspace-stat">
            <FolderOpen size={20} />
            <div className="workspace-stat__info">
              <span className="workspace-stat__value">{Object.keys(groupedFiles).length}</span>
              <span className="workspace-stat__label">Proyek</span>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="workspace-page__upload-area">
          <Upload size={40} className="workspace-upload__icon" />
          <h3 className="workspace-upload__title">Upload File Inspeksi</h3>
          <p className="workspace-upload__desc">
            Drag & drop file di sini, atau klik untuk memilih file
          </p>
          <p className="workspace-upload__formats">
            Mendukung: RAW, TIFF, MP4, JPG, PNG, DNG (Maks 2GB per file)
          </p>
        </div>

        {/* Files Grouped by Project */}
        <div className="workspace-page__groups">
          {Object.entries(groupedFiles).map(([projectId, group]) => (
            <div key={projectId} className="workspace-group">
              <div className="workspace-group__header">
                <FolderOpen size={18} className="workspace-group__folder-icon" />
                <h3 className="workspace-group__name">{group.projectName}</h3>
                <span className="workspace-group__count">{group.files.length} file</span>
              </div>
              <div className="workspace-group__files">
                {group.files.map((file) => {
                  const FileIcon = getFileIcon(file.tipe);
                  return (
                    <div key={file.id} className="workspace-file">
                      <div className="workspace-file__icon-wrap">
                        <FileIcon size={20} />
                      </div>
                      <div className="workspace-file__info">
                        <span className="workspace-file__name">{file.nama_file}</span>
                        <div className="workspace-file__meta">
                          <span className="workspace-file__type">{file.tipe}</span>
                          <span className="workspace-file__size">{formatFileSize(file.ukuran)}</span>
                          <span className="workspace-file__date">
                            <Calendar size={12} />
                            {file.tanggal_upload}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PilotDashboardShell>
    </div>
  );
}

export default PilotWorkspacePage;
