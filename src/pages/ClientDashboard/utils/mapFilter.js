/**
 * Pure helpers untuk Map_Filter pada Section_Asset_Monitoring_Map.
 *
 * Kontrak (sesuai design.md §"AssetMonitoringMap" dan Requirements 5.10, 5.10a):
 *  - `filterAssets(assets, filterValue)`:
 *      * `filterValue === 'all'` → kembalikan list `assets` apa adanya
 *        (referential identity dipertahankan; tidak meng-clone).
 *      * Selain itu → kembalikan asset yang `status === filterValue`.
 *      * Tidak memutasi input `assets`.
 *  - `getDisabledFilterOptions(assets)`:
 *      * Kembalikan array status (`'aman' | 'perlu_perhatian' | 'kritis'`)
 *        yang TIDAK pernah muncul pada `assets`.
 *      * Opsi `'all'` TIDAK pernah disabled — selalu valid sebagai filter
 *        netral (Requirement 5.10a: filter tidak boleh menghasilkan
 *        peta kosong, tapi 'all' menampilkan semua → tetap valid).
 *      * Urutan output stabil: mengikuti urutan `MAP_STATUSES`.
 *
 * Status yang dipertimbangkan: 'aman', 'perlu_perhatian', 'kritis'.
 * 'all' adalah nilai filter khusus yang TIDAK termasuk dalam status asset.
 */

/**
 * Daftar status asset valid pada Map_Filter (urutan stabil untuk
 * konsistensi output `getDisabledFilterOptions`).
 *
 * @type {ReadonlyArray<'aman' | 'perlu_perhatian' | 'kritis'>}
 */
export const MAP_STATUSES = Object.freeze(['aman', 'perlu_perhatian', 'kritis']);

/**
 * Filter list asset berdasarkan nilai filter aktif Map_Filter.
 *
 * @param {ReadonlyArray<{ status: string }>} assets - Daftar asset dari Mock_Data_Module.
 * @param {'all' | 'aman' | 'perlu_perhatian' | 'kritis'} filterValue - Nilai filter aktif.
 * @returns {ReadonlyArray<{ status: string }>} Subset asset yang lolos filter.
 *          Saat `filterValue === 'all'`, list asli dikembalikan apa adanya.
 */
export function filterAssets(assets, filterValue) {
  if (filterValue === 'all') {
    return assets;
  }
  return assets.filter((asset) => asset.status === filterValue);
}

/**
 * Hitung opsi Map_Filter yang harus disabled — yaitu status yang tidak
 * memiliki asset terkait, agar user tidak dapat memilih filter yang akan
 * menghasilkan peta kosong (Requirement 5.10a).
 *
 * Opsi `'all'` tidak pernah disabled dan tidak pernah muncul di output.
 *
 * @param {ReadonlyArray<{ status: string }>} assets - Daftar asset dari Mock_Data_Module.
 * @returns {Array<'aman' | 'perlu_perhatian' | 'kritis'>}
 *          Array status yang TIDAK ada di `assets`. Urutan mengikuti `MAP_STATUSES`.
 */
export function getDisabledFilterOptions(assets) {
  const present = new Set();
  for (const asset of assets) {
    present.add(asset.status);
  }
  return MAP_STATUSES.filter((status) => !present.has(status));
}
