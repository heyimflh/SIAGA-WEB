/**
 * projectResolver.js — pure resolver untuk default `selectedProjectId`
 * pada Section_Project_Timeline.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 6.3, 6.4b, 6.4c, 15.1
 *
 * Kontrak `resolveInitialProjectId(mockData, stored)`:
 *
 * 1. Jika `mockData.proyek_aktif` kosong (length === 0) → kembalikan
 * `null`. Caller (ProjectTimeline) menampilkan empty state
 * "Belum ada proyek aktif" .
 *
 * 2. Jika `stored` merupakan string yang cocok dengan salah satu
 * `proyek_aktif[i].id` → kembalikan `stored` .
 *
 * 3. Selain itu (stored null/undefined/non-string, atau stored stale
 * yang tidak lagi ada di list) → kembalikan `proyek_aktif[0].id`
 * sebagai default .
 *
 * Fungsi murni: tidak melakukan I/O, tidak membaca/menulis localStorage.
 * Caller bertanggung jawab membaca `stored` via `safeReadLocalStorage`
 * sebelum memanggil resolver ini.
 *
 * Defensive terhadap input non-konvensional:
 * - `mockData` dianggap bisa berupa object dengan `proyek_aktif` berupa
 * array. Jika `proyek_aktif` bukan array (tidak terdefinisi di
 * mock-data), perlakukan sebagai list kosong → kembalikan `null`.
 * - `stored` boleh bernilai `null`, `undefined`, atau string. Tipe
 * non-string lain di-treat seperti `null`.
 */

/**
 * @typedef {{ id: string }} ProjectLike
 * @typedef {{ proyek_aktif: ReadonlyArray<ProjectLike> }} MockDataLike
 */

/**
 * @param {MockDataLike} mockData
 * @param {string | null | undefined} stored
 * @returns {string | null}
 */
export function resolveInitialProjectId(mockData, stored) {
 const list =
 mockData && Array.isArray(mockData.proyek_aktif)
 ? mockData.proyek_aktif
 : [];

 // empty state, caller render empty UI.
 if (list.length === 0) {
 return null;
 }

 // b — restore pilihan lintas-session jika masih valid.
 if (typeof stored === 'string' && list.some((p) => p && p.id === stored)) {
 return stored;
 }

 // c — default ke proyek pertama.
 return list[0].id;
}
