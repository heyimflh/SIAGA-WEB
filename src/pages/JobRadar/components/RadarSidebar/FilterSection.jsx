import { RotateCcw } from 'lucide-react';
import InfrastructureChips from './InfrastructureChips.jsx';
import ValueRangeSlider from './ValueRangeSlider.jsx';
import LocationSearch from './LocationSearch.jsx';
import StatusToggle from './StatusToggle.jsx';
import { getActiveFilterCount, getLocationSuggestions } from '../../filters.js';
import './FilterSection.css';

/**
 * FilterSection — Compact glass filter controls.
 */
export default function FilterSection({ filters, onFiltersChange, onResetFilters, projects }) {
  const activeCount = getActiveFilterCount(filters);
  const locationSuggestions = getLocationSuggestions(projects);

  const handleChipsChange = (chips) => {
    onFiltersChange({ ...filters, chips });
  };

  const handleRangeChange = (valueRange) => {
    onFiltersChange({ ...filters, valueRange });
  };

  const handleLocationChange = (location) => {
    onFiltersChange({ ...filters, location });
  };

  const handleStatusChange = (statusFilter) => {
    onFiltersChange({ ...filters, statusFilter });
  };

  return (
    <div className="filter-section">
      <div className="filter-section__header">
        <span className="filter-section__label">Filter Proyek</span>
        {activeCount > 0 && (
          <button
            className="filter-section__reset"
            onClick={onResetFilters}
            aria-label="Reset semua filter"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <InfrastructureChips
        activeChips={filters.chips}
        onChange={handleChipsChange}
      />

      <ValueRangeSlider
        value={filters.valueRange}
        onChange={handleRangeChange}
      />

      <LocationSearch
        value={filters.location}
        onChange={handleLocationChange}
        suggestions={locationSuggestions}
      />

      <StatusToggle
        value={filters.statusFilter}
        onChange={handleStatusChange}
      />
    </div>
  );
}
