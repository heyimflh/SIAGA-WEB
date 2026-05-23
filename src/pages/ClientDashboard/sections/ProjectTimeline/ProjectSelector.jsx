import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { safeWriteLocalStorage } from '../../utils/storage.js';

const STORAGE_KEY = 'siaga.client.lastSelectedProjectId';

function ProjectSelector({ projects, selectedProjectId, onSelectProject }) {
 const isDesktop = useMediaQuery('(min-width: 1280px)');

 function handleSelect(id) {
 onSelectProject(id);
 safeWriteLocalStorage(STORAGE_KEY, id);
 }

 if (!projects || projects.length === 0) {
 return null;
 }

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
