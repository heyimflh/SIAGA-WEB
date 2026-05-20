/**
 * Round-trip property test for formatRupiah/parseRupiah.
 * Feature: pilot-dashboard
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatRupiah, parseRupiah } from '../utils/formatRupiah.js';

describe('formatRupiah round-trip', () => {
  it('parseRupiah(formatRupiah(n)) === n for non-negative integers', () => {
    fc.assert(
      fc.property(fc.nat(999999999999), (n) => {
        const formatted = formatRupiah(n);
        const parsed = parseRupiah(formatted);
        expect(parsed).toBe(n);
      })
    );
  });

  it('formatRupiah always starts with Rp', () => {
    fc.assert(
      fc.property(fc.nat(), (n) => {
        expect(formatRupiah(n).startsWith('Rp')).toBe(true);
      })
    );
  });

  it('parseRupiah returns 0 for non-string input', () => {
    expect(parseRupiah(null)).toBe(0);
    expect(parseRupiah(123)).toBe(0);
  });
});
