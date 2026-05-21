/**
 * BiddingReviewTable.jsx — Section D: Bidding Review Table.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates implementation
 *
 * Pipeline: eligibleBids(bids) → applyChips(bidFilters) → applySort(bidSort)
 *
 * Props:
 * - bids: Array — raw bids for the selected project
 * - bidFilters: { siagaVerifiedOnly: boolean, ratingMin4: boolean }
 * - bidSort: { key, direction } | null
 * - onToggleChip: (chipName) => void
 * - onSort: (key) => void
 * - onResetFilters: () => void
 * - onViewProfile: (bid) => void
 * - onSelectPilot: (bid) => void
 */

import { Inbox, FilterX, Megaphone } from 'lucide-react';
import { eligibleBids, applyChips, applySort } from '../../utils/bids.js';
import { BidFilterChips, SortControl } from './BidFilterChips.jsx';
import BidRow from './BidRow.jsx';
import './BiddingReviewTable.css';

/**
 * Table column headers — maps to `<th scope="col">`.
 */
const TABLE_COLUMNS = [
 { key: 'avatar', label: 'Avatar Pilot', sortable: false },
 { key: 'nama', label: 'Nama Pilot', sortable: false },
 { key: 'verified', label: 'SIAGA Verified', sortable: false },
 { key: 'rating', label: 'Rating', sortable: true },
 { key: 'harga', label: 'Harga Bid', sortable: true },
 { key: 'estimasi_hari', label: 'Estimasi Hari', sortable: true },
 { key: 'drone_type', label: 'Drone Type', sortable: false },
 { key: 'aksi', label: 'Aksi', sortable: false },
];

/**
 * Resolves `aria-sort` for a column header.
 */
function getAriaSortForColumn(columnKey, bidSort) {
 if (!bidSort || bidSort.key !== columnKey) return undefined;
 return bidSort.direction === 'asc' ? 'ascending' : 'descending';
}

/**
 * Builds a human-readable summary of active filters for the empty-after-filter state.
 */
function buildFilterSummary(bidFilters) {
 const parts = [];
 if (bidFilters.siagaVerifiedOnly) parts.push('SIAGA Verified Only');
 if (bidFilters.ratingMin4) parts.push('Rating Min 4 Bintang');
 return parts.join(' + ');
}

function BiddingReviewTable({
 bids,
 bidFilters,
 bidSort,
 onToggleChip,
 onSort,
 onResetFilters,
 onViewProfile,
 onSelectPilot,
}) {
 // Empty state: no bids at all for this project
 if (!bids || bids.length === 0) {
 return (
 <section className="bidding-review" aria-labelledby="bidding-title">
 <h2 id="bidding-title" className="bidding-review__title">
 Penawaran Pilot
 </h2>
 <div className="bidding-review__empty">
 <Inbox size={48} className="bidding-review__empty-icon" aria-hidden="true" />
 <p className="bidding-review__empty-text">
 Belum ada penawaran masuk untuk proyek ini
 </p>
 <button type="button" className="bidding-review__promote-btn">
 <Megaphone size={16} aria-hidden="true" />
 <span>Promosikan Proyek</span>
 </button>
 </div>
 </section>
 );
 }

 // Pre-filter: always apply rating >= 2 threshold
 const eligible = eligibleBids(bids);

 // Apply filter chips (AND composition)
 const filtered = applyChips(eligible, bidFilters);

 // Apply sort
 const sorted = applySort(filtered, bidSort);

 // Empty state: eligible bids exist but chips filter them all out
 const isFilteredEmpty = eligible.length > 0 && sorted.length === 0;

 return (
 <section className="bidding-review" aria-labelledby="bidding-title">
 <h2 id="bidding-title" className="bidding-review__title">
 Penawaran Pilot
 </h2>

 {/* Filter chips + sort controls */}
 <div className="bidding-review__controls">
 <BidFilterChips filters={bidFilters} onToggleChip={onToggleChip} />
 <SortControl
 sortKey={bidSort?.key ?? null}
 sortDirection={bidSort?.direction ?? null}
 onSort={onSort}
 />
 </div>

 {/* Empty state after filter */}
 {isFilteredEmpty ? (
 <div className="bidding-review__empty bidding-review__empty--filtered">
 <FilterX size={40} className="bidding-review__empty-icon" aria-hidden="true" />
 <p className="bidding-review__empty-text">
 Tidak ada penawaran yang cocok dengan filter aktif
 </p>
 <p className="bidding-review__filter-summary">
 Filter aktif: <strong>{buildFilterSummary(bidFilters)}</strong>
 </p>
 <button
 type="button"
 className="bidding-review__reset-btn"
 onClick={onResetFilters}
 >
 Reset Filter
 </button>
 </div>
 ) : (
 /* Semantic table */
 <div className="bidding-review__table-wrapper">
 <table className="bid-table" role="table">
 <thead>
 <tr>
 {TABLE_COLUMNS.map((col) => (
 <th
 key={col.key}
 scope="col"
 className={`bid-table__th bid-table__th--${col.key}`}
 aria-sort={col.sortable ? getAriaSortForColumn(col.key, bidSort) : undefined}
 >
 {col.label}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {sorted.map((bid) => (
 <BidRow
 key={bid.pilot_id}
 bid={bid}
 onViewProfile={onViewProfile}
 onSelectPilot={onSelectPilot}
 />
 ))}
 </tbody>
 </table>
 </div>
 )}
 </section>
 );
}

export default BiddingReviewTable;
