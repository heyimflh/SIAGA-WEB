import { ShieldCheck, Star, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './BidFilterChips.css';

const SORT_COLUMNS = [
 { key: 'harga', label: 'Harga' },
 { key: 'rating', label: 'Rating' },
 { key: 'estimasi_hari', label: 'Estimasi Hari' },
];

function getAriaSortValue(columnKey, activeSortKey, activeSortDirection) {
 if (columnKey !== activeSortKey || !activeSortDirection) return 'none';
 return activeSortDirection === 'asc' ? 'ascending' : 'descending';
}

export function BidFilterChips({ filters, onToggleChip }) {
 const { siagaVerifiedOnly, ratingMin4 } = filters;

 return (
 <div className="bid-filter-chips" role="group" aria-label="Filter penawaran">
 <button
 type="button"
 className={`bid-chip ${siagaVerifiedOnly ? 'bid-chip--active' : ''}`}
 onClick={() => onToggleChip('siagaVerifiedOnly')}
 aria-pressed={siagaVerifiedOnly}
 >
 <ShieldCheck size={16} aria-hidden="true" />
 <span>SIAGA Verified Only</span>
 </button>

 <button
 type="button"
 className={`bid-chip ${ratingMin4 ? 'bid-chip--active' : ''}`}
 onClick={() => onToggleChip('ratingMin4')}
 aria-pressed={ratingMin4}
 >
 <Star size={16} aria-hidden="true" />
 <span>Rating Min 4 Bintang</span>
 </button>
 </div>
 );
}


export function SortControl({ sortKey, sortDirection, onSort }) {
 return (
 <div className="bid-sort-controls" role="group" aria-label="Urutkan penawaran">
 {SORT_COLUMNS.map((col) => {
 const ariaSortValue = getAriaSortValue(col.key, sortKey, sortDirection);
 const isActive = col.key === sortKey && sortDirection !== null;

 return (
 <button
 key={col.key}
 type="button"
 className={`bid-sort-btn ${isActive ? 'bid-sort-btn--active' : ''}`}
 onClick={() => onSort(col.key)}
 aria-sort={ariaSortValue}
 aria-label={`Urutkan berdasarkan ${col.label}, saat ini ${
 ariaSortValue === 'none'
 ? 'tidak diurutkan'
 : ariaSortValue === 'ascending'
 ? 'naik'
 : 'turun'
 }`}
 >
 {isActive && sortDirection === 'asc' && <ArrowUp size={14} aria-hidden="true" />}
 {isActive && sortDirection === 'desc' && <ArrowDown size={14} aria-hidden="true" />}
 {!isActive && <ArrowUpDown size={14} aria-hidden="true" />}
 <span>{col.label}</span>
 </button>
 );
 })}
 </div>
 );
}


export default BidFilterChips;
