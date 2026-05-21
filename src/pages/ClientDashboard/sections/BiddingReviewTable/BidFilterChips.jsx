/**
 * BidFilterChips.jsx — Filter chips dan kontrol sort untuk Section D (Bidding Review Table).
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 13.9
 *
 * Props for BidFilterChips:
 * - filters: { siagaVerifiedOnly: boolean, ratingMin4: boolean }
 * - onToggleChip: (chipName: 'siagaVerifiedOnly' | 'ratingMin4') => void
 *
 * Props for SortControl (embedded):
 * - sortKey: 'harga' | 'rating' | 'estimasi_hari' | null
 * - sortDirection: 'asc' | 'desc' | null
 * - onSort: (key: 'harga' | 'rating' | 'estimasi_hari') => void
 */

import { ShieldCheck, Star, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './BidFilterChips.css';

/**
 * Sortable column definitions for the bidding table.
 * Each entry maps to a Bid_Sort_Key .
 */
const SORT_COLUMNS = [
 { key: 'harga', label: 'Harga' },
 { key: 'rating', label: 'Rating' },
 { key: 'estimasi_hari', label: 'Estimasi Hari' },
];

/**
 * Resolves the `aria-sort` attribute value for a column header .
 * @param {string} columnKey
 * @param {string|null} activeSortKey
 * @param {'asc'|'desc'|null} activeSortDirection
 * @returns {'ascending'|'descending'|'none'}
 */
function getAriaSortValue(columnKey, activeSortKey, activeSortDirection) {
 if (columnKey !== activeSortKey || !activeSortDirection) return 'none';
 return activeSortDirection === 'asc' ? 'ascending' : 'descending';
}

/**
 * BidFilterChips — renders two toggle chips above the bidding table.
 *
 * - "SIAGA Verified Only" → toggles `siagaVerifiedOnly` (Req 7.7, 7.8)
 * - "Rating Min 4 Bintang" → toggles `ratingMin4` (Req 7.7, 7.9)
 *
 * Clicking a chip toggles its state (AND composition, Req 7.10).
 */
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

/**
 * SortControl — renders sort buttons for each sortable column.
 *
 * Each button cycles: none → ascending → descending → none.
 * Active sort column shows directional arrow; inactive shows neutral icon.
 * Each button carries `aria-sort` for accessibility .
 */
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

/**
 * Combined export: BidFilterChips (default) + named SortControl.
 * Parent BiddingReviewTable imports both.
 */
export default BidFilterChips;
