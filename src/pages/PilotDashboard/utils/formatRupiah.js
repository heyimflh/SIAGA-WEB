/**
 * formatRupiah.js — Format and parse Indonesian Rupiah currency.
 *
 * Pure functions, no side effects.
 * Feature: pilot-dashboard
 * Validates: Requirements 15
 */

export function formatRupiah(number) {
  if (typeof number !== 'number' || isNaN(number)) return 'Rp 0';
  const formatted = Math.round(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

export function parseRupiah(formatted) {
  if (typeof formatted !== 'string') return 0;
  const cleaned = formatted.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
