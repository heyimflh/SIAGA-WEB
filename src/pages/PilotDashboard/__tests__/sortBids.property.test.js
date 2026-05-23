import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { sortBids } from '../utils/sortBids.js';

const bidArb = fc.record({
 id: fc.string(),
 status: fc.constantFrom('pending', 'diterima', 'ditolak'),
 tanggal_submit: fc.integer({ min: 1, max: 365 }).map((d) => {
 const date = new Date('2025-01-01');
 date.setDate(date.getDate() + d);
 return date.toISOString().split('T')[0];
 }),
});

describe('sortBids', () => {
 it('returns same elements (permutation)', () => {
 fc.assert(
 fc.property(fc.array(bidArb), fc.constantFrom('terbaru', 'status'), (bids, criteria) => {
 const sorted = sortBids(bids, criteria);
 expect(sorted.length).toBe(bids.length);
 const sortedIds = sorted.map((b) => b.id).sort();
 const originalIds = [...bids].map((b) => b.id).sort();
 expect(sortedIds).toEqual(originalIds);
 })
 );
 });

 it('does not mutate original array', () => {
 fc.assert(
 fc.property(fc.array(bidArb), (bids) => {
 const copy = [...bids];
 sortBids(bids, 'terbaru');
 expect(bids).toEqual(copy);
 })
 );
 });

 it('returns empty array for non-array input', () => {
 expect(sortBids(null)).toEqual([]);
 expect(sortBids(undefined)).toEqual([]);
 });
});
