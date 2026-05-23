import './MapFilter.css';

const FILTER_OPTIONS = [
 { value: 'all', label: 'Semua' },
 { value: 'kritis', label: 'Kritis Saja' },
 { value: 'perlu_perhatian', label: 'Perlu Perhatian Saja' },
];

function MapFilter({ activeFilter, disabledOptions = [], onFilterChange }) {
 return (
 <div className="map-filter" role="group" aria-label="Filter status aset">
 {FILTER_OPTIONS.map((option) => {
 const isDisabled = disabledOptions.includes(option.value);
 const isActive = activeFilter === option.value;

 return (
 <button
 key={option.value}
 type="button"
 className={`map-filter__btn${isActive ? ' map-filter__btn--active' : ''}`}
 disabled={isDisabled}
 aria-pressed={isActive}
 onClick={() => onFilterChange(option.value)}
 >
 {option.label}
 </button>
 );
 })}
 </div>
 );
}

export default MapFilter;
