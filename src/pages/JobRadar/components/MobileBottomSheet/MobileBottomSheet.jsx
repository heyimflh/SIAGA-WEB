import { useEffect } from 'react';
import { GripHorizontal, AlertTriangle } from 'lucide-react';
import FilterSection from '../RadarSidebar/FilterSection.jsx';
import ProjectList from '../RadarSidebar/ProjectList.jsx';
import './MobileBottomSheet.css';

/**
 * MobileBottomSheet — Replaces desktop sidebar on mobile (<768px).
 * Has collapsed (60-80px) and expanded (60-70vh) states.
 */
export default function MobileBottomSheet({
  state,
  onStateChange,
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
  const isExpanded = state === 'expanded';

  // Escape to collapse
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        onStateChange('collapsed');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, onStateChange]);

  const handleToggle = () => {
    onStateChange(isExpanded ? 'collapsed' : 'expanded');
  };

  return (
    <div className={`mobile-bottom-sheet ${isExpanded ? 'mobile-bottom-sheet--expanded' : ''}`}>
      {/* Drag Handle */}
      <button
        className="mobile-bottom-sheet__handle"
        onClick={handleToggle}
        aria-label={isExpanded ? 'Tutup panel' : 'Buka panel filter dan proyek'}
        aria-expanded={isExpanded}
      >
        <GripHorizontal size={20} className="mobile-bottom-sheet__grip" />
      </button>

      {/* Collapsed Summary */}
      {!isExpanded && (
        <div className="mobile-bottom-sheet__summary" onClick={handleToggle}>
          <span className="mobile-bottom-sheet__count">{projects.length} proyek tersedia</span>
          {stats.urgent > 0 && (
            <span className="mobile-bottom-sheet__urgent">
              <AlertTriangle size={11} />
              {stats.urgent} urgent
            </span>
          )}
          <span className="mobile-bottom-sheet__hint">Tap untuk filter & list</span>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mobile-bottom-sheet__content">
          <div className="mobile-bottom-sheet__header">
            <h3 className="mobile-bottom-sheet__title">SIAGA Job Radar</h3>
            <span className="mobile-bottom-sheet__badge">{stats.aktif} aktif</span>
          </div>

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
            onCardClick={(project) => {
              onCardClick(project);
              onStateChange('collapsed');
            }}
            onDetailClick={onDetailClick}
            onBidClick={onBidClick}
            onResetFilters={onResetFilters}
          />
        </div>
      )}
    </div>
  );
}
