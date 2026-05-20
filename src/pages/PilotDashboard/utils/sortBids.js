/**
 * sortBids.js — Pure bid sorting function.
 *
 * Feature: pilot-dashboard
 * Validates: Requirements 8, 15
 */

const STATUS_ORDER = { pending: 0, diterima: 1, ditolak: 2 };

export function sortBids(bids, criteria = 'terbaru') {
  if (!Array.isArray(bids)) return [];
  const copy = [...bids];

  if (criteria === 'status') {
    return copy.sort((a, b) => {
      const orderA = STATUS_ORDER[a.status] ?? 99;
      const orderB = STATUS_ORDER[b.status] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.tanggal_submit) - new Date(a.tanggal_submit);
    });
  }

  // Default: terbaru (newest first)
  return copy.sort((a, b) => new Date(b.tanggal_submit) - new Date(a.tanggal_submit));
}
