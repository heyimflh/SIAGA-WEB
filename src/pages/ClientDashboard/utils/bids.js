/**
 * bids.js — Pure utility functions for bid filtering, sorting, and
 * pre-filter threshold logic.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 7.2a, 7.5, 7.6, 7.8, 7.9, 7.10
 *
 * Pipeline used by BiddingReviewTable:
 *   eligibleBids(bids) → applyChips(result, chips) → applySort(result, sort)
 */

/**
 * Minimum rating threshold — bids below this are NEVER shown regardless of
 * any filter chip state (Requirement 7.2a).
 */
export const ELIGIBLE_THRESHOLD = 2;

/**
 * Pre-filter: removes bids with rating below ELIGIBLE_THRESHOLD.
 * @param {Array<{rating: number}>} bids
 * @returns {Array} bids with rating >= ELIGIBLE_THRESHOLD
 */
export function eligibleBids(bids) {
  return bids.filter((b) => b.rating >= ELIGIBLE_THRESHOLD);
}

/**
 * AND-composition filter chips (Requirements 7.8, 7.9, 7.10).
 * Each active chip further restricts the result set.
 *
 * @param {Array} bids - already pre-filtered by eligibleBids
 * @param {{ siagaVerifiedOnly: boolean, ratingMin4: boolean }} chips
 * @returns {Array} filtered bids
 */
export function applyChips(bids, { siagaVerifiedOnly, ratingMin4 }) {
  return bids.filter(
    (b) =>
      (!siagaVerifiedOnly || b.siaga_verified === true) &&
      (!ratingMin4 || b.rating >= 4)
  );
}

/**
 * Stable sort with tie-break on pilot_id.localeCompare (Requirements 7.5, 7.6).
 * Returns a new array (does not mutate input).
 *
 * @param {Array} bids
 * @param {{ key: 'harga' | 'rating' | 'estimasi_hari', direction: 'asc' | 'desc' } | null} sort
 * @returns {Array} sorted copy of bids, or original reference if sort is null/undefined
 */
export function applySort(bids, sort) {
  if (!sort) return bids;
  const { key, direction } = sort;
  return [...bids].sort((a, b) => {
    const cmp =
      a[key] === b[key]
        ? a.pilot_id.localeCompare(b.pilot_id)
        : a[key] > b[key]
          ? 1
          : -1;
    return direction === 'asc' ? cmp : -cmp;
  });
}
