import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
 { value: 'terbaru', label: 'Terbaru' },
 { value: 'nilai_tertinggi', label: 'Nilai Tertinggi' },
 { value: 'deadline_terdekat', label: 'Deadline Terdekat' },
];

/**
 * SortControl — Pill-style sort selector.
 */
export default function SortControl({ sortBy, onSortChange }) {
 return (
 <div className="sort-control" aria-label={`Urutan: ${SORT_OPTIONS.find(o => o.value === sortBy)?.label}`}>
 <ArrowUpDown size={12} style={{ opacity: 0.6 }} />
 <select
 className="sort-control__select"
 value={sortBy}
 onChange={(e) => onSortChange(e.target.value)}
 aria-label="Urutkan proyek"
 >
 {SORT_OPTIONS.map(opt => (
 <option key={opt.value} value={opt.value}>{opt.label}</option>
 ))}
 </select>
 </div>
 );
}
