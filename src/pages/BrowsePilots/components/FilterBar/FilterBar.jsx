import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { SPECIALIZATION_OPTIONS, RATING_OPTIONS, PROVINCE_OPTIONS } from '../../mock-data.js';
import { getResultSummary } from '../../filters.js';
import './FilterBar.css';

export default function FilterBar({
 filters, onFiltersChange, resultCount, visibleCount,
 onReset, onOpenMobileFilter, activeFilterCount,
}) {
 const summary = getResultSummary(resultCount, visibleCount);

 const toggleSpec = (spec) => {
 const current = filters.specializations || [];
 const next = current.includes(spec)
 ? current.filter((s) => s !== spec)
 : [...current, spec];
 onFiltersChange({ ...filters, specializations: next });
 };

 const setRating = (value) => {
 onFiltersChange({
 ...filters,
 minRating: filters.minRating === value ? null : value,
 });
 };

 const setProvince = (e) => {
 onFiltersChange({ ...filters, province: e.target.value || null });
 };

 const toggleVerified = () => {
 onFiltersChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
 };

 return (
 <div className="pilots-filter-bar">
 <div className="pilots-filter-bar__desktop">
 <div className="pilots-filter-bar__controls">
 <div className="pilots-filter-bar__specs" role="group"
 aria-label="Filter spesialisasi">
 {SPECIALIZATION_OPTIONS.map((spec) => (
 <button
 key={spec}
 role="checkbox"
 aria-checked={filters.specializations.includes(spec)}
 className={`pilots-filter-chip ${filters.specializations.includes(spec) ? 'pilots-filter-chip--active' : ''}`}
 onClick={() => toggleSpec(spec)}
 >
 {spec}
 </button>
 ))}
 </div>

 <select
 className="pilots-filter-bar__province"
 value={filters.province || ''}
 onChange={setProvince}
 aria-label="Filter provinsi"
 >
 <option value="">Semua Provinsi</option>
 {PROVINCE_OPTIONS.map((p) => (
 <option key={p} value={p}>{p}</option>
 ))}
 </select>


 <div className="pilots-filter-bar__rating" role="radiogroup"
 aria-label="Filter rating minimum">
 {RATING_OPTIONS.map((opt) => (
 <button
 key={opt.value}
 role="radio"
 aria-checked={filters.minRating === opt.value}
 className={`pilots-filter-rating-btn ${filters.minRating === opt.value ? 'pilots-filter-rating-btn--active' : ''}`}
 onClick={() => setRating(opt.value)}
 >
 {opt.label}
 </button>
 ))}
 </div>


 <button
 role="switch"
 aria-checked={filters.verifiedOnly}
 className={`pilots-filter-verified ${filters.verifiedOnly ? 'pilots-filter-verified--active' : ''}`}
 onClick={toggleVerified}
 >
 Verified Only
 </button>

 {activeFilterCount > 0 && (
 <button className="pilots-filter-reset" onClick={onReset}>
 <RotateCcw size={14} />
 Reset
 </button>
 )}
 </div>

 <div className="pilots-filter-bar__summary" aria-live="polite">
 <span className="pilots-filter-bar__count">{summary.total}</span>
 {summary.visible && (
 <span className="pilots-filter-bar__visible">{summary.visible}</span>
 )}
 </div>
 </div>

 <div className="pilots-filter-bar__mobile">
 <button className="pilots-filter-mobile-btn" onClick={onOpenMobileFilter}>
 <SlidersHorizontal size={16} />
 Filter
 {activeFilterCount > 0 && (
 <span className="pilots-filter-mobile-btn__count">{activeFilterCount}</span>
 )}
 </button>

 <button
 role="switch"
 aria-checked={filters.verifiedOnly}
 className={`pilots-filter-verified pilots-filter-verified--mobile ${filters.verifiedOnly ? 'pilots-filter-verified--active' : ''}`}
 onClick={toggleVerified}
 >
 Verified
 </button>

 {activeFilterCount > 0 && (
 <button className="pilots-filter-reset pilots-filter-reset--mobile" onClick={onReset}>
 <RotateCcw size={14} />
 </button>
 )}

 <div className="pilots-filter-bar__summary pilots-filter-bar__summary--mobile" aria-live="polite">
 <span>{summary.total}</span>
 </div>
 </div>
 </div>
 );
}
