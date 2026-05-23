export const ELIGIBLE_THRESHOLD = 2;

export function eligibleBids(bids) {
 return bids.filter((b) => b.rating >= ELIGIBLE_THRESHOLD);
}

export function applyChips(bids, { siagaVerifiedOnly, ratingMin4 }) {
 return bids.filter(
 (b) =>
 (!siagaVerifiedOnly || b.siaga_verified === true) &&
 (!ratingMin4 || b.rating >= 4)
 );
}

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
