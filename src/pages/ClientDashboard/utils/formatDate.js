// Pure date formatting helpers for client-dashboard feature.
// Uses Intl.DateTimeFormat with locale 'id-ID' so the output matches
// Indonesian conventions referenced by Requirement 3.3.
//
// All functions are total (return a string for any reasonable input)
// and side-effect free.

const ID_LONG_DATE_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
 * Coerce the given input into a `Date` instance.
 * Accepts a `Date`, ISO timestamp string, or numeric epoch ms.
 * Returns `null` when the value cannot be converted into a valid Date.
 *
 * @param {Date|string|number|null|undefined} input
 * @returns {Date | null}
 */
function toDate(input) {
  if (input == null) return null;
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date as a long Indonesian date string.
 *
 * Example:
 *   formatIndonesianDate(new Date('2026-01-15')) === 'Kamis, 15 Januari 2026'
 *
 * Validates: Requirement 3.3 (tanggal hari ini dalam format lokal Indonesia,
 * mis. "Senin, 15 Januari 2026").
 *
 * @param {Date|string|number} date - A `Date` instance, ISO string, or epoch ms.
 * @returns {string} The formatted date, or an empty string when the input is invalid.
 */
export function formatIndonesianDate(date) {
  const d = toDate(date);
  if (d === null) return '';
  return ID_LONG_DATE_FORMATTER.format(d);
}

export default formatIndonesianDate;
