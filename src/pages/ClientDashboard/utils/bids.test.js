/**
 * Unit tests for bids.js utility functions.
 * Validates: Requirements 7.2a, 7.5, 7.6, 7.8, 7.9, 7.10
 */
import { describe, it, expect } from 'vitest';
import {
  ELIGIBLE_THRESHOLD,
  eligibleBids,
  applyChips,
  applySort,
} from './bids.js';

const sampleBids = [
  { pilot_id: 'P-A', rating: 4.8, siaga_verified: true, harga: 20_000_000, estimasi_hari: 5 },
  { pilot_id: 'P-B', rating: 1.5, siaga_verified: false, harga: 10_000_000, estimasi_hari: 12 },
  { pilot_id: 'P-C', rating: 3.2, siaga_verified: false, harga: 15_000_000, estimasi_hari: 8 },
  { pilot_id: 'P-D', rating: 4.1, siaga_verified: true, harga: 18_000_000, estimasi_hari: 6 },
  { pilot_id: 'P-E', rating: 2.0, siaga_verified: true, harga: 12_000_000, estimasi_hari: 10 },
];

describe('ELIGIBLE_THRESHOLD', () => {
  it('should be 2', () => {
    expect(ELIGIBLE_THRESHOLD).toBe(2);
  });
});

describe('eligibleBids', () => {
  it('removes bids with rating < 2', () => {
    const result = eligibleBids(sampleBids);
    expect(result).toHaveLength(4);
    expect(result.every((b) => b.rating >= 2)).toBe(true);
  });

  it('keeps bids with rating exactly 2', () => {
    const result = eligibleBids(sampleBids);
    expect(result.find((b) => b.pilot_id === 'P-E')).toBeDefined();
  });

  it('returns empty array for empty input', () => {
    expect(eligibleBids([])).toEqual([]);
  });

  it('returns empty array when all bids below threshold', () => {
    const lowBids = [
      { pilot_id: 'X', rating: 0.5 },
      { pilot_id: 'Y', rating: 1.9 },
    ];
    expect(eligibleBids(lowBids)).toEqual([]);
  });
});

describe('applyChips', () => {
  const eligible = eligibleBids(sampleBids);

  it('returns all eligible bids when no chips active', () => {
    const result = applyChips(eligible, { siagaVerifiedOnly: false, ratingMin4: false });
    expect(result).toHaveLength(4);
  });

  it('filters to siaga_verified only', () => {
    const result = applyChips(eligible, { siagaVerifiedOnly: true, ratingMin4: false });
    expect(result.every((b) => b.siaga_verified === true)).toBe(true);
    expect(result).toHaveLength(3); // P-A, P-D, P-E
  });

  it('filters to rating >= 4 only', () => {
    const result = applyChips(eligible, { siagaVerifiedOnly: false, ratingMin4: true });
    expect(result.every((b) => b.rating >= 4)).toBe(true);
    expect(result).toHaveLength(2); // P-A, P-D
  });

  it('AND-composition: both chips active', () => {
    const result = applyChips(eligible, { siagaVerifiedOnly: true, ratingMin4: true });
    expect(result.every((b) => b.siaga_verified === true && b.rating >= 4)).toBe(true);
    expect(result).toHaveLength(2); // P-A, P-D
  });

  it('monotonic: adding chips never increases result count', () => {
    const noChips = applyChips(eligible, { siagaVerifiedOnly: false, ratingMin4: false });
    const oneChip = applyChips(eligible, { siagaVerifiedOnly: true, ratingMin4: false });
    const twoChips = applyChips(eligible, { siagaVerifiedOnly: true, ratingMin4: true });
    expect(noChips.length).toBeGreaterThanOrEqual(oneChip.length);
    expect(oneChip.length).toBeGreaterThanOrEqual(twoChips.length);
  });
});

describe('applySort', () => {
  const eligible = eligibleBids(sampleBids);

  it('returns same reference when sort is null', () => {
    const result = applySort(eligible, null);
    expect(result).toBe(eligible);
  });

  it('returns same reference when sort is undefined', () => {
    const result = applySort(eligible, undefined);
    expect(result).toBe(eligible);
  });

  it('sorts by harga ascending', () => {
    const result = applySort(eligible, { key: 'harga', direction: 'asc' });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].harga).toBeGreaterThanOrEqual(result[i - 1].harga);
    }
  });

  it('sorts by harga descending', () => {
    const result = applySort(eligible, { key: 'harga', direction: 'desc' });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].harga).toBeLessThanOrEqual(result[i - 1].harga);
    }
  });

  it('sorts by rating ascending', () => {
    const result = applySort(eligible, { key: 'rating', direction: 'asc' });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].rating).toBeGreaterThanOrEqual(result[i - 1].rating);
    }
  });

  it('sorts by estimasi_hari descending', () => {
    const result = applySort(eligible, { key: 'estimasi_hari', direction: 'desc' });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].estimasi_hari).toBeLessThanOrEqual(result[i - 1].estimasi_hari);
    }
  });

  it('tie-break uses pilot_id.localeCompare for stable sort', () => {
    const tiedBids = [
      { pilot_id: 'P-C', rating: 4.0, harga: 15_000_000, estimasi_hari: 7 },
      { pilot_id: 'P-A', rating: 4.0, harga: 15_000_000, estimasi_hari: 7 },
      { pilot_id: 'P-B', rating: 4.0, harga: 15_000_000, estimasi_hari: 7 },
    ];
    const result = applySort(tiedBids, { key: 'harga', direction: 'asc' });
    expect(result.map((b) => b.pilot_id)).toEqual(['P-A', 'P-B', 'P-C']);
  });

  it('does not mutate the input array', () => {
    const original = [...eligible];
    applySort(eligible, { key: 'harga', direction: 'asc' });
    expect(eligible).toEqual(original);
  });

  it('result is a permutation of input (same elements)', () => {
    const result = applySort(eligible, { key: 'rating', direction: 'desc' });
    expect(result).toHaveLength(eligible.length);
    for (const bid of eligible) {
      expect(result).toContainEqual(bid);
    }
  });
});
