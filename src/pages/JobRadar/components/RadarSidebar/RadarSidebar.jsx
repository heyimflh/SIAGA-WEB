import { ChevronLeft } from 'lucide-react';
import SidebarHeader from './SidebarHeader.jsx';
import FilterSection from './FilterSection.jsx';
import ProjectList from './ProjectList.jsx';
import './RadarSidebar.css';

/**
 * RadarSidebar — Dark glass command panel for Job Radar.
 * Contains header, filters, sort, and mission card list.
 */
export default function RadarSidebar({
  isOpen,
  isOverlay,
  onToggle,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  projects,
  stats,
  hoveredCardId,
  highlightedCardId,
  onCardHover,
  onCardClick,
  onDetailClick,
  onBidClick,
  onResetFilters,
}) {
  const sidebarClasses = [
    'radar-sidebar',
    !isOpen && 'radar-sidebar--hidden',
    isOverlay && 'radar-sidebar--overlay',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Overlay backdrop for tablet */}
      {isOverlay && (
        <div
          className={`radar-sidebar-overlay-backdrop ${isOpen ? 'radar-sidebar-overlay-backdrop--visible' : ''}`}
          onClick={onToggle}
        />
      )}

      <aside className={sidebarClasses} aria-label="Radar Sidebar">
        {/* Toggle button */}
        <button
          className="radar-sidebar__toggle"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Tutup sidebar' : 'Buka sidebar'}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="radar-sidebar__content">
          <SidebarHeader stats={stats} />

          <FilterSection
            filters={filters}
            onFiltersChange={onFiltersChange}
            onResetFilters={onResetFilters}
            projects={projects}
          />

          <ProjectList
            projects={projects}
            sortBy={sortBy}
            onSortChange={onSortChange}
            hoveredCardId={hoveredCardId}
            highlightedCardId={highlightedCardId}
            onCardHover={onCardHover}
            onCardClick={onCardClick}
            onDetailClick={onDetailClick}
            onBidClick={onBidClick}
            onResetFilters={onResetFilters}
          />
        </div>
      </aside>
    </>
  );
}
