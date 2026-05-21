/**
 * ProjectSelector — Tab/dropdown untuk memilih proyek aktif pada
 * Section_Project_Timeline.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 6.2, 6.3, 6.4, 6.4a, 6.4b, 6.4c, 13.4
 *
 * Behavior:
 * - ≥1280px: render `<div role="tablist">` dengan tab buttons.
 * - <1280px: render `<select>` untuk simplicity mobile.
 * - Default selection di-resolve oleh parent via
 * `resolveInitialProjectId(mockData, safeReadLocalStorage(...))`.
 * - On select: dispatch `onSelectProject(id)` ke parent yang mengelola
 * state `selectedProjectId` + menulis ke localStorage via
 * `safeWriteLocalStorage`.
 *
 * Props:
 * - projects: ReadonlyArray<{ id: string, nama: string }>
 * - selectedProjectId: string | null
 * - onSelectProject: (id: string) => void
 */

import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { safeWriteLocalStorage } from '../../utils/storage.js';

const STORAGE_KEY = 'siaga.client.lastSelectedProjectId';

/**
 * @param {{ projects: ReadonlyArray<{ id: string, nama: string }>, selectedProjectId: string | null, onSelectProject: (id: string) => void }} props
 */
function ProjectSelector({ projects, selectedProjectId, onSelectProject }) {
 const isDesktop = useMediaQuery('(min-width: 1280px)');

 /**
 * Handle selection change — dispatch ke parent + persist ke localStorage.
 * @param {string} id
 */
 function handleSelect(id) {
 onSelectProject(id);
 safeWriteLocalStorage(STORAGE_KEY, id);
 }

 // No projects → nothing to render (empty state handled by parent ProjectTimeline)
 if (!projects || projects.length === 0) {
 return null;
 }

 // Desktop: tablist
 if (isDesktop) {
 return (
 <div
 className="project-selector project-selector--tabs"
 role="tablist"
 aria-label="Pilih proyek"
 >
 {projects.map((project) => {
 const isSelected = project.id === selectedProjectId;
 return (
 <button
 key={project.id}
 role="tab"
 type="button"
 id={`project-tab-${project.id}`}
 aria-selected={isSelected}
 aria-controls={`project-panel-${project.id}`}
 tabIndex={isSelected ? 0 : -1}
 className={`project-selector__tab${isSelected ? ' project-selector__tab--active' : ''}`}
 onClick={() => handleSelect(project.id)}
 >
 {project.nama}
 </button>
 );
 })}
 </div>
 );
 }

 // Mobile/Tablet: select dropdown
 return (
 <div className="project-selector project-selector--dropdown">
 <label
 htmlFor="project-selector-select"
 className="project-selector__label"
 >
 Pilih Proyek
 </label>
 <select
 id="project-selector-select"
 className="project-selector__select"
 value={selectedProjectId || ''}
 onChange={(e) => handleSelect(e.target.value)}
 >
 {projects.map((project) => (
 <option key={project.id} value={project.id}>
 {project.nama}
 </option>
 ))}
 </select>
 </div>
 );
}

export default ProjectSelector;
