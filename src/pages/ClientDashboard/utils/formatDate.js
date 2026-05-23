const ID_LONG_DATE_FORMATTER = new Intl.DateTimeFormat('id-ID', {
 weekday: 'long',
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

export function formatIndonesianDate(date) {
 const d = toDate(date);
 if (d === null) return '';
 return ID_LONG_DATE_FORMATTER.format(d);
}

export default formatIndonesianDate;
