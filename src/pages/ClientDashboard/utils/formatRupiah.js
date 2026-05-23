const THOUSAND_SEPARATOR = '.';
const PREFIX = 'Rp ';

export function formatRupiah(n) {
 if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) {
 return `${PREFIX}0`;
 }

 const intValue = Math.trunc(n);

 if (intValue === 0) {
 return `${PREFIX}0`;
 }

 const digits = String(intValue);
 let grouped = '';
 for (let i = 0; i < digits.length; i += 1) {
 if (i > 0 && (digits.length - i) % 3 === 0) {
 grouped += THOUSAND_SEPARATOR;
 }
 grouped += digits[i];
 }

 return `${PREFIX}${grouped}`;
}

export function parseRupiah(str) {
 if (typeof str !== 'string') {
 return NaN;
 }

 const stripped = str.replace(/\s+/g, '');
 if (stripped === '') {
 return NaN;
 }

 const withoutPrefix = stripped.replace(/^rp/i, '');

 const digitsOnly = withoutPrefix.replace(/\./g, '');

 if (digitsOnly === '' || !/^\d+$/.test(digitsOnly)) {
 return NaN;
 }

 return Number.parseInt(digitsOnly, 10);
}
