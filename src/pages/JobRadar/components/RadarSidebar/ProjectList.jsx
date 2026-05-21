import { useRef, useEffect } from 'react';
import { SearchX } from 'lucide-react';
import SortControl from './SortControl.jsx';
import ProjectCard from './ProjectCard.jsx';
import './ProjectList.css';

/**
 * ProjectList — Scrollable list of Mission Cards with sort control and empty state.
 */
export default function ProjectList({
 projects,
 sortBy,
 onSortChange,
 hoveredCardId,
 highlightedCardId,
 onCardHover,
 onCardClick,
 onDetailClick,
 onBidClick,
 onResetFilters,
}) {
 const listRef = useRef(null);

 // Scroll to highlighted card when pin is clicked
 useEffect(() => {
 if (highlightedCardId && listRef.current) {
 const cardEl = listRef.current.querySelector(`[data-project-id="${highlightedCardId}"]`);
 if (cardEl) {
 cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
 }
 }
 }, [highlightedCardId]);

 return (
 <div className="project-list">
 <div className="project-list__header">
 <span className="project-list__count">{projects.length} proyek</span>
 <SortControl sortBy={sortBy} onSortChange={onSortChange} />
 </div>

 <div className="project-list__items" ref={listRef}>
 {projects.length === 0 ? (
 <div className="project-list__empty">
 <SearchX size={32} className="project-list__empty-icon" />
 <p className="project-list__empty-title">Tidak ada proyek yang cocok dengan filter.</p>
 <p className="project-list__empty-subtitle">Coba reset filter atau perluas kriteria pencarian.</p>
 <button
 className="project-list__empty-reset"
 onClick={onResetFilters}
 >
 Reset Filter
 </button>
 </div>
 ) : (
 projects.map(project => (
 <div key={project.id} data-project-id={project.id}>
 <ProjectCard
 project={project}
 isHovered={hoveredCardId === project.id}
 isHighlighted={highlightedCardId === project.id}
 onHover={onCardHover}
 onClick={onCardClick}
 onDetailClick={onDetailClick}
 onBidClick={onBidClick}
 />
 </div>
 ))
 )}
 </div>
 </div>
 );
}
