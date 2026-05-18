/**
 * formatRupiah / parseRupiah — round-trip safe currency helpers
 * untuk locale id-ID (separator ribuan menggunakan titik).
 *
 * Invariant utama (round-trip):
 *   parseRupiah(formatRupiah(n)) === n
 * untuk semua integer non-negatif n.
 *
 * Contoh:
 *   formatRupiah(0)        === 'Rp 0'
 *   formatRupiah(1000000)  === 'Rp 1.000.000'
 *   parseRupiah('Rp 1.000.000') === 1000000
 *   parseRupiah('  Rp   1.000.000  ') === 1000000
 *
 * Catatan: format dengan separator manual (bukan langsung Intl.NumberFormat
 * agar output deterministik lintas environment Node/browser yang kadang
 * memakai non-breaking space sebagai grouping atau menempatkan simbol
 * mata uang berbeda).
 */

const THOUSAND_SEPARATOR = '.';
const PREFIX = 'Rp ';

/**
 * Format integer non-negatif ke string Rupiah locale id-ID.
 *
 * @param {number} n - Integer non-negatif. Nilai non-finite atau negatif
 *                     dikembalikan sebagai 'Rp 0' untuk menjaga UI tidak crash.
 * @returns {string} Misal: `'Rp 1.000.000'`.
 */
export function formatRupiah(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) {
    return `${PREFIX}0`;
  }

  // Bulatkan ke integer terdekat agar round-trip dengan parseRupiah konsisten
  // (parseRupiah hanya mengembalikan integer karena separator desimal di-strip).
  const intValue = Math.trunc(n);

  if (intValue === 0) {
    return `${PREFIX}0`;
  }

  // Sisipkan titik tiap 3 digit dari kanan tanpa bergantung pada Intl
  // (Intl bisa memakai \u00A0 atau format lain di environment tertentu).
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

/**
 * Parse string Rupiah ter-format kembali ke integer.
 *
 * Toleran terhadap:
 *  - whitespace di awal/akhir/tengah (spasi, tab, non-breaking space).
 *  - prefix `'Rp'` dengan/tanpa spasi (case-insensitive).
 *  - separator ribuan titik (akan di-strip).
 *
 * @param {string} str
 * @returns {number} Integer hasil parse, atau `NaN` jika input tidak valid
 *                   (mis. mengandung huruf selain `Rp`, atau kosong setelah
 *                    di-strip).
 */
export function parseRupiah(str) {
  if (typeof str !== 'string') {
    return NaN;
  }

  // Hilangkan SEMUA whitespace (termasuk \u00A0 non-breaking space).
  const stripped = str.replace(/\s+/g, '');
  if (stripped === '') {
    return NaN;
  }

  // Hilangkan prefix 'Rp' (case-insensitive) jika ada.
  const withoutPrefix = stripped.replace(/^rp/i, '');

  // Hilangkan separator ribuan titik.
  const digitsOnly = withoutPrefix.replace(/\./g, '');

  if (digitsOnly === '' || !/^\d+$/.test(digitsOnly)) {
    return NaN;
  }

  return Number.parseInt(digitsOnly, 10);
}
