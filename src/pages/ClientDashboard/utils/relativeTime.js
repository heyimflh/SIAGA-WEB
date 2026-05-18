// Pure relative-time formatter for client-dashboard activity timestamps.
// Produces short Indonesian phrases such as "baru saja", "5 menit lalu",
// "2 jam lalu", "kemarin", "3 hari lalu", referenced by Requirement 8.2.
//
// All functions are total and side-effect free so they can be tested
// without any DOM. `now` is injectable so tests can pin the clock.

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

const ID_DAY_MONTH_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
});

const ID_FULL_DATE_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
 * Coerce the given input into a `Date` instance, or `null` if invalid.
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
 * Format an ISO timestamp as an Indonesian relative-time phrase.
 *
 * Examples (with `now` fixed for clarity):
 *   relativeTime(t,        now) // "baru saja"        — diff < 60s
 *   relativeTime(t-5*60e3, now) // "5 menit lalu"
 *   relativeTime(t-2*3600e3, now) // "2 jam lalu"
 *   relativeTime(yesterday, now)  // "kemarin"
 *   relativeTime(t-3*86400e3, now) // "3 hari lalu"
 *   relativeTime(t-2*7*86400e3, now) // "2 minggu lalu"
 *   older same year   → "15 Januari"
 *   older other year  → "15 Januari 2024"
 *
 * Future timestamps (timestamp > now) collapse to "baru saja" so the
 * function never returns a negative phrase.
 *
 * Validates: Requirement 8.2.
 *
 * @param {Date|string|number} timestampISO - ISO string, Date, or epoch ms.
 * @param {Date|string|number} [now] - Reference clock; defaults to `new Date()`.
 * @returns {string}
 */
export function relativeTime(timestampISO, now) {
  const then = toDate(timestampISO);
  const reference = toDate(now ?? new Date()) ?? new Date();
  if (then === null) return '';

  const diffMs = reference.getTime() - then.getTime();

  // Future or essentially-now timestamps collapse to "baru saja".
  if (diffMs < MINUTE_MS) {
    return 'baru saja';
  }

  if (diffMs < HOUR_MS) {
    const minutes = Math.floor(diffMs / MINUTE_MS);
    return `${minutes} menit lalu`;
  }

  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / HOUR_MS);
    return `${hours} jam lalu`;
  }

  // Compare calendar days so "kemarin" depends on the wall-clock day,
  // not on a strict 24-hour window.
  const startOfRefDay = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate(),
  );
  const startOfThenDay = new Date(
    then.getFullYear(),
    then.getMonth(),
    then.getDate(),
  );
  const dayDiff = Math.round(
    (startOfRefDay.getTime() - startOfThenDay.getTime()) / DAY_MS,
  );

  if (dayDiff === 1) {
    return 'kemarin';
  }

  if (dayDiff < 7) {
    return `${dayDiff} hari lalu`;
  }

  if (diffMs < 4 * WEEK_MS) {
    const weeks = Math.floor(diffMs / WEEK_MS);
    return `${weeks} minggu lalu`;
  }

  // Older than ~4 weeks: fall back to a localized absolute date.
  if (then.getFullYear() === reference.getFullYear()) {
    return ID_DAY_MONTH_FORMATTER.format(then);
  }
  return ID_FULL_DATE_FORMATTER.format(then);
}

export default relativeTime;
