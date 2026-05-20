import { X } from 'lucide-react';
import './ActiveFilterChips.css';

export default function ActiveFilterChips({ query, filters, onRemoveFilter, onClearAll }) {
  const chips = [];

  if (query && query.trim()) {
    chips.push({ type: 'search', label: `"${query}"`, value: query });
  }
  if (filters.specializations) {
    filters.specializations.forEach((s) => {
      chips.push({ type: 'specialization', label: s, value: s });
    });
  }
  if (filters.province) {
    chips.push({ type: 'province', label: filters.province, value: filters.province });
  }
  if (filters.minRating) {
    chips.push({ type: 'rating', label: `Rating ${filters.minRating}+`, value: filters.minRating });
  }
  if (filters.verifiedOnly) {
    chips.push({ type: 'verified', label: 'Verified Only', value: true });
  }

  if (chips.length === 0) return null;

  return (
    <div className="pilots-active-chips">
      {chips.map((chip) => (
        <button
          key={`${chip.type}-${chip.value}`}
          className="pilots-active-chip"
          onClick={() => onRemoveFilter(chip.type, chip.value)}
          aria-label={`Hapus filter ${chip.label}`}
        >
          <span>{chip.label}</span>
          <X size={12} />
        </button>
      ))}
      {chips.length > 1 && (
        <button className="pilots-active-chip pilots-active-chip--clear" onClick={onClearAll}>
          Clear All
        </button>
      )}
    </div>
  );
}
