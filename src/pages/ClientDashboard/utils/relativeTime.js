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

function toDate(input) {
 if (input == null) return null;
 if (input instanceof Date) {
 return Number.isNaN(input.getTime()) ? null : input;
 }
 const d = new Date(input);
 return Number.isNaN(d.getTime()) ? null : d;
}

export function relativeTime(timestampISO, now) {
 const then = toDate(timestampISO);
 const reference = toDate(now ?? new Date()) ?? new Date();
 if (then === null) return '';

 const diffMs = reference.getTime() - then.getTime();

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

 if (then.getFullYear() === reference.getFullYear()) {
 return ID_DAY_MONTH_FORMATTER.format(then);
 }
 return ID_FULL_DATE_FORMATTER.format(then);
}

export default relativeTime;
