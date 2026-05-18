/**
 * Safe localStorage helpers untuk Client Dashboard.
 *
 * Kontrak (sesuai design.md §"Storage Failures" dan Requirements 6.4a, 16.1, 16.1a):
 *  - `safeReadLocalStorage(key)`:
 *      * Membungkus akses `localStorage.getItem` dengan try/catch.
 *      * Mengembalikan string yang tersimpan jika ada.
 *      * Mengembalikan `null` jika key tidak ada, environment tidak punya
 *        `localStorage` (SSR / iframe sandbox / privacy mode), atau jika
 *        akses melempar (mis. `SecurityError` di mode privasi Safari).
 *      * Read failure tidak boleh meng-crash UI; caller (mis. resolver
 *        `selectedProjectId`) akan jatuh ke default.
 *
 *  - `safeWriteLocalStorage(key, value)`:
 *      * Membungkus akses `localStorage.setItem` dengan try/catch.
 *      * Jika gagal (mis. `QuotaExceededError`, environment tanpa storage,
 *        privacy mode), error di-log via `console.warn` lalu di-swallow
 *        tanpa throw — UX user tidak terganggu.
 *      * Tidak mengembalikan nilai (void).
 *
 * Pola defensif mengikuti `src/auth/AuthContext.jsx` (try/catch di sekitar
 * setiap akses storage, plus penjagaan `typeof window`).
 */

/**
 * @param {string} key - Nama key di localStorage (mis. `'siaga.client.lastSelectedProjectId'`).
 * @returns {string | null} Nilai tersimpan, atau `null` saat tidak ada / akses gagal.
 */
export function safeReadLocalStorage(key) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ?? null;
  } catch {
    // SecurityError / privacy mode / storage disabled → fallback ke null.
    return null;
  }
}

/**
 * @param {string} key - Nama key di localStorage.
 * @param {string} value - Nilai string yang akan disimpan.
 * @returns {void}
 */
export function safeWriteLocalStorage(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    // Tidak perlu warn berulang untuk environment tanpa storage (mis. SSR/test
    // tanpa jsdom localStorage). Cukup swallow.
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    // Quota exceeded, privacy mode, dsb. Swallow agar tidak meng-crash UI.
    console.warn('[siaga] safeWriteLocalStorage failed', { key, err });
  }
}
