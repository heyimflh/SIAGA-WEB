import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
 selectPendingBidCount,
 selectProyekBerjalanCount,
 selectTotalEarnings,
 selectRatingAvg,
 selectUrgentDeadlineCount,
} from '../utils/selectors.js';

describe('selectPendingBidCount', () => {
 it('returns count of bids with status pending', () => {
 fc.assert(
 fc.property(
 fc.array(
 fc.record({
 id: fc.string(),
 status: fc.constantFrom('pending', 'diterima', 'ditolak'),
 })
 ),
 (bids) => {
 const result = selectPendingBidCount(bids);
 const expected = bids.filter((b) => b.status === 'pending').length;
 expect(result).toBe(expected);
 }
 )
 );
 });

 it('returns 0 for non-array input', () => {
 expect(selectPendingBidCount(null)).toBe(0);
 expect(selectPendingBidCount(undefined)).toBe(0);
 expect(selectPendingBidCount('string')).toBe(0);
 });
});

describe('selectProyekBerjalanCount', () => {
 it('returns array length', () => {
 fc.assert(
 fc.property(fc.array(fc.anything()), (arr) => {
 expect(selectProyekBerjalanCount(arr)).toBe(arr.length);
 })
 );
 });
});

describe('selectTotalEarnings', () => {
 it('returns total_kumulatif from earnings object', () => {
 fc.assert(
 fc.property(fc.nat(), (n) => {
 expect(selectTotalEarnings({ total_kumulatif: n })).toBe(n);
 })
 );
 });

 it('returns 0 for invalid input', () => {
 expect(selectTotalEarnings(null)).toBe(0);
 expect(selectTotalEarnings({})).toBe(0);
 });
});

describe('selectRatingAvg', () => {
 it('returns rating_avg from profile', () => {
 fc.assert(
 fc.property(fc.float({ min: 0, max: 5, noNaN: true }), (rating) => {
 expect(selectRatingAvg({ rating_avg: rating })).toBe(rating);
 })
 );
 });
});

describe('selectUrgentDeadlineCount', () => {
 it('counts projects with deadline <= 3 days from now', () => {
 const now = new Date('2026-01-15');
 const projects = [
 { deadline: '2026-01-16' },
 { deadline: '2026-01-18' },
 { deadline: '2026-01-20' },
 ];
 expect(selectUrgentDeadlineCount(projects, now)).toBe(2);
 });
});
