import { describe, it, expect } from 'vitest';
import { formatRupiah, parseRupiah } from './formatRupiah.js';

describe('formatRupiah', () => {
 it('formats 0 as "Rp 0"', () => {
 expect(formatRupiah(0)).toBe('Rp 0');
 });

 it('formats 1000000 with id-ID dot separators', () => {
 expect(formatRupiah(1000000)).toBe('Rp 1.000.000');
 });

 it('formats small numbers without separator', () => {
 expect(formatRupiah(1)).toBe('Rp 1');
 expect(formatRupiah(999)).toBe('Rp 999');
 });

 it('formats numbers at thousand boundary', () => {
 expect(formatRupiah(1000)).toBe('Rp 1.000');
 expect(formatRupiah(10000)).toBe('Rp 10.000');
 expect(formatRupiah(100000)).toBe('Rp 100.000');
 });

 it('formats large numbers (miliar)', () => {
 expect(formatRupiah(1_250_000_000)).toBe('Rp 1.250.000.000');
 });

 it('returns "Rp 0" for non-finite or negative input (safe fallback)', () => {
 expect(formatRupiah(NaN)).toBe('Rp 0');
 expect(formatRupiah(Infinity)).toBe('Rp 0');
 expect(formatRupiah(-1)).toBe('Rp 0');
 });
});

describe('parseRupiah', () => {
 it('parses "Rp 1.000.000" to 1000000', () => {
 expect(parseRupiah('Rp 1.000.000')).toBe(1000000);
 });

 it('parses "Rp 0" to 0', () => {
 expect(parseRupiah('Rp 0')).toBe(0);
 });

 it('tolerates leading/trailing whitespace', () => {
 expect(parseRupiah(' Rp 1.000.000 ')).toBe(1000000);
 expect(parseRupiah('\tRp 1.000\n')).toBe(1000);
 });

 it('tolerates whitespace between prefix and digits', () => {
 expect(parseRupiah('Rp 1.000.000')).toBe(1000000);
 expect(parseRupiah('Rp\u00A01.000')).toBe(1000); // non-breaking space
 });

 it('tolerates missing space after Rp', () => {
 expect(parseRupiah('Rp1.000.000')).toBe(1000000);
 });

 it('returns NaN for invalid input', () => {
 expect(parseRupiah('')).toBeNaN();
 expect(parseRupiah('Rp abc')).toBeNaN();
 expect(parseRupiah(null)).toBeNaN();
 expect(parseRupiah(undefined)).toBeNaN();
 });
});

describe('round-trip property (smoke)', () => {
 it('parseRupiah(formatRupiah(n)) === n for representative values', () => {
 const samples = [0, 1, 999, 1000, 12345, 1_000_000, 4_320_000_000];
 for (const n of samples) {
 expect(parseRupiah(formatRupiah(n))).toBe(n);
 }
 });
});
