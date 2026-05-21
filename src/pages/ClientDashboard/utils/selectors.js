/**
 * selectors.js — pure derivations atas Mock_Data_Module.
 *
 * Spec: .kiro/specs/client-dashboard
 * Validates: Requirements 10.4, 10.5, 10.6, 10.7, 10.8, 10.9
 *
 * Selectors di sini adalah fungsi pure — deterministik, tanpa side-effect,
 * dan beroperasi langsung atas struktur dari `mock-data.js`. Karena seluruh
 * section dashboard membaca dari sumber yang sama via selector ini,
 * konsistensi cross-section (Map_Floating_Stats vs Overview_Card vs
 * Quick_Stats_Footer) terjamin by construction — tidak butuh property test
 * runtime untuk –10.9.
 *
 * Catatan tentang shape input:
 * - `data` adalah object hasil `mockData` di `mock-data.js`.
 * - `data.assets` adalah array (lihat shape `Asset` di design.md).
 * - `data.proyek_aktif` adalah array project; selector menghitung jumlah
 * project yang `is_active !== false` agar konsisten dengan
 * ("entri proyek_aktif yang berstatus aktif").
 * - `data.bids` adalah flat array bid lintas project, di-key oleh
 * `project_id` (lihat design.md).
 * - `data.perusahaan` adalah object tunggal dengan field `nama`, `email`,
 * `avatar`. Resolver `selectCompanyByEmail` mencocokkan email session
 * ke entry ini.
 *
 * Fallback `selectCompanyByEmail`: jika email tidak cocok dengan
 * `perusahaan.email`, selector mengembalikan object synthesized
 * `{ nama: email, email, avatar: null }` agar Topbar greeting tetap dapat
 * me-render "Halo, [email]" tanpa crash. Pola ini sesuai design.md §
 * Components > ClientDashboardPage ("fallback ke session.email").
 */

/**
 * Jumlah total aset terdaftar.
 *
 * Dipakai oleh Map_Floating_Stats "[N] Aset Termonitor" dan Overview_Card
 * "Total Aset Terinspeksi" sehingga keduanya konsisten by construction.
 *
 * @param {{ assets: ReadonlyArray<unknown> }} data
 * @returns {number}
 */
export function selectAssetCount(data) {
 return data.assets.length;
}

/**
 * Jumlah aset dengan `status === 'kritis'`.
 *
 * Dipakai oleh Map_Floating_Stats "[M] Kritis".
 *
 * @param {{ assets: ReadonlyArray<{ status: string }> }} data
 * @returns {number}
 */
export function selectKritisCount(data) {
 return data.assets.filter((a) => a.status === 'kritis').length;
}

/**
 * Jumlah aset dengan `status === 'perlu_perhatian'`.
 *
 * Dipakai oleh Map_Floating_Stats "[K] Perlu Perhatian".
 *
 * @param {{ assets: ReadonlyArray<{ status: string }> }} data
 * @returns {number}
 */
export function selectPerluPerhatianCount(data) {
 return data.assets.filter((a) => a.status === 'perlu_perhatian').length;
}

/**
 * Jumlah project aktif (`is_active !== false`).
 *
 * Konvensi: project tanpa field `is_active` dianggap aktif (default), agar
 * data-shape ringkas; hanya project yang secara eksplisit `is_active: false`
 * yang dikecualikan. Ini sejalan dengan design.md §"Selectors murni".
 *
 * @param {{ proyek_aktif: ReadonlyArray<{ is_active?: boolean }> }} data
 * @returns {number}
 */
export function selectActiveProjectCount(data) {
 return data.proyek_aktif.filter((p) => p.is_active !== false).length;
}

/**
 * Bid yang dimiliki sebuah project tertentu.
 *
 * Memfilter flat `data.bids` berdasarkan `project_id`. Jika tidak ada bid
 * untuk project tersebut (mis. project baru) selector mengembalikan array
 * kosong — caller (BiddingReviewTable) menggunakannya untuk men-trigger
 * empty state *
 * @param {{ bids: ReadonlyArray<{ project_id: string }> }} data
 * @param {string} projectId
 * @returns {Array<{ project_id: string }>}
 */
export function selectBidsForProject(data, projectId) {
 return data.bids.filter((b) => b.project_id === projectId);
}

/**
 * Resolve perusahaan dari email session.
 *
 * Cocokkan `email` (case-insensitive, trimmed) ke `data.perusahaan.email`.
 * Jika tidak cocok, kembalikan synthesized object dengan `nama: email`
 * sehingga Topbar greeting tetap dapat me-render "Halo, [email]".
 *
 * Contoh:
 * selectCompanyByEmail(mockData, 'hendra@pln.co.id')
 * → mockData.perusahaan
 *
 * selectCompanyByEmail(mockData, 'unknown@example.com')
 * → { nama: 'unknown@example.com', email: 'unknown@example.com', avatar: null }
 *
 * @param {{ perusahaan: { nama: string, email: string, avatar: string | null } }} data
 * @param {string} email
 * @returns {{ nama: string, email: string, avatar: string | null }}
 */
export function selectCompanyByEmail(data, email) {
 const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';
 const perusahaan = data.perusahaan;

 if (
 perusahaan &&
 typeof perusahaan.email === 'string' &&
 perusahaan.email.trim().toLowerCase() === normalized &&
 normalized.length > 0
 ) {
 return perusahaan;
 }

 // Fallback: gunakan email itu sendiri sebagai nama agar UI tidak crash
 // ketika session email tidak terdaftar di mock data. Field `email`
 // dipertahankan apa adanya (tidak di-lowercase) supaya tampil sesuai input.
 const safeEmail = typeof email === 'string' ? email : '';
 return {
 nama: safeEmail,
 email: safeEmail,
 avatar: null,
 };
}
