/**
 * mock-data.js — single source of truth untuk seluruh data dummy
 * Client Dashboard.
 *
 * Spec: .kiro/specs/client-dashboard
 * Mock data for client dashboard features.
 *
 * Catatan invariant (dijaga manual, bukan runtime check karena data adalah
 * single source under our control):
 *
 * - perusahaan.email === email session login mock (auth-pages). Pak Hendra
 * dipakai sebagai persona A pada PRD; resolver `selectCompanyByEmail`
 * mencocokkan email session ke entry ini, dengan fallback ke email itu
 * sendiri jika tidak ditemukan.
 *
 * - Setiap project's `milestones` mengikuti aturan: paling banyak satu
 * milestone berstatus `in_progress`; semua milestone sebelumnya
 * `completed`; semua milestone sesudahnya `upcoming`.
 *
 * - `assets` berisi 7 entries dengan campuran status `aman`,
 * `perlu_perhatian`, dan `kritis`.
 *
 * - `bids` berisi 5-7 entries per `project_id`, dengan rating 0..5 dan
 * mencakup nilai di atas/bawah threshold rating 2
 * untuk memberikan demo material yang bermakna pada filter chip.
 *
 * - `activities` berisi 10 entries dengan timestamp ISO datetime.
 *
 * Module is deeply frozen to prevent mutation and ensure data integrity.
 */

/**
 * deepFreeze — membekukan object beserta seluruh nested object/array.
 * @template T
 * @param {T} obj
 * @returns {Readonly<T>}
 */
function deepFreeze(obj) {
 if (obj === null || typeof obj !== 'object' || Object.isFrozen(obj)) {
 return obj;
 }
 for (const key of Object.keys(obj)) {
 deepFreeze(obj[key]);
 }
 return Object.freeze(obj);
}

// ---------------------------------------------------------------------------
// Perusahaan (Persona A — Pak Hendra, PT PLN)
// ---------------------------------------------------------------------------

const perusahaan = {
 nama: 'PT PLN (Persero)',
 email: 'hendra@pln.co.id',
 avatar: '/images/avatars/Avatar 10.jpg',
};

// ---------------------------------------------------------------------------
// Overview Metrics
// ---------------------------------------------------------------------------

const overview_metrics = {
 proyek_aktif: { value: 12, trend_pct: 8 },
 aset_terinspeksi: { value: 487, target_tahunan: 600 },
 budget: { used: 4_320_000_000, total: 6_000_000_000 },
 proyek_selesai_bulan_ini: { value: 7, delta_vs_last_month: 3 },
};

// ---------------------------------------------------------------------------
// Assets — 7 entries (mix aman / perlu_perhatian / kritis)
// Lokasi: tersebar di Pulau Jawa (kasus PT PLN).
// ---------------------------------------------------------------------------

const assets = [
 {
 id: 'A-001',
 nama: 'SUTET Bandung Utara',
 kategori: 'sutet',
 lat: -6.8650,
 lng: 107.6191,
 status: 'kritis',
 inspeksi_terakhir: { tanggal: '2025-12-18', pilot_nama: 'Andi Pratama' },
 foto_url: '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 },
 {
 id: 'A-002',
 nama: 'Tower Transmisi Cirebon',
 kategori: 'tower',
 lat: -6.7320,
 lng: 108.5523,
 status: 'perlu_perhatian',
 inspeksi_terakhir: { tanggal: '2025-12-22', pilot_nama: 'Budi Santoso' },
 foto_url: '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 },
 {
 id: 'A-003',
 nama: 'Jembatan Kabel Suramadu Sektor B',
 kategori: 'jembatan',
 lat: -7.1832,
 lng: 112.7800,
 status: 'aman',
 inspeksi_terakhir: { tanggal: '2026-01-05', pilot_nama: 'Citra Lestari' },
 foto_url: '/images/services-categories/Jembatan___Jalan_Tol_300kb.jpg',
 },
 {
 id: 'A-004',
 nama: 'Pipa Migas Balongan',
 kategori: 'pipa',
 lat: -6.3580,
 lng: 108.3970,
 status: 'aman',
 inspeksi_terakhir: { tanggal: '2026-01-02', pilot_nama: 'Dewi Anjani' },
 foto_url: '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
 },
 {
 id: 'A-005',
 nama: 'Kilang Cilacap Unit 3',
 kategori: 'kilang',
 lat: -7.7320,
 lng: 109.0150,
 status: 'kritis',
 inspeksi_terakhir: { tanggal: '2025-12-28', pilot_nama: 'Eko Wibowo' },
 foto_url: '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
 },
 {
 id: 'A-006',
 nama: 'SUTET Semarang Timur',
 kategori: 'sutet',
 lat: -6.9930,
 lng: 110.4200,
 status: 'aman',
 inspeksi_terakhir: { tanggal: '2026-01-08', pilot_nama: 'Fajar Nugroho' },
 foto_url: '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 },
 {
 id: 'A-007',
 nama: 'Tower Transmisi Surabaya Barat',
 kategori: 'tower',
 lat: -7.2750,
 lng: 112.6400,
 status: 'perlu_perhatian',
 inspeksi_terakhir: { tanggal: '2025-12-30', pilot_nama: 'Gita Saraswati' },
 foto_url: '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 },
];

// ---------------------------------------------------------------------------
// Proyek Aktif — 3 entries dengan 5 milestones tiap project.
// Invariant: paling banyak satu `in_progress`; sebelumnya `completed`;
// sesudahnya `upcoming`.
// ---------------------------------------------------------------------------

const proyek_aktif = [
 {
 id: 'P-001',
 nama: 'Inspeksi SUTET Bandung Selatan',
 is_active: true,
 milestones: {
 posted: { status: 'completed', date: '2025-11-20' },
 bidding_open: { status: 'completed', date: '2025-11-25' },
 pilot_selected: { status: 'completed', date: '2025-12-05' },
 inspection_in_progress: { status: 'in_progress', date: '2025-12-15' },
 report_ready: { status: 'upcoming', date: '2026-01-20' },
 },
 },
 {
 id: 'P-002',
 nama: 'Audit Pipa Migas Cilacap',
 is_active: true,
 milestones: {
 posted: { status: 'completed', date: '2025-12-10' },
 bidding_open: { status: 'in_progress', date: '2025-12-20' },
 pilot_selected: { status: 'upcoming', date: '2026-01-15' },
 inspection_in_progress: { status: 'upcoming', date: '2026-02-01' },
 report_ready: { status: 'upcoming', date: '2026-02-25' },
 },
 },
 {
 id: 'P-003',
 nama: 'Survei Tower Transmisi Surabaya',
 is_active: true,
 milestones: {
 posted: { status: 'completed', date: '2025-10-15' },
 bidding_open: { status: 'completed', date: '2025-10-22' },
 pilot_selected: { status: 'completed', date: '2025-11-05' },
 inspection_in_progress: { status: 'completed', date: '2025-11-20' },
 report_ready: { status: 'in_progress', date: '2025-12-30' },
 },
 },
];

// ---------------------------------------------------------------------------
// Bids — 5-7 entries per project_id.
// Mencakup nilai di atas/bawah threshold rating 2 agar
// pre-filter `eligibleBids` punya material untuk demo. Mencakup juga nilai
// rating < 4 dan >= 4, serta siaga_verified true/false untuk filter chip.
// ---------------------------------------------------------------------------

const bids = [
 // ---- Project P-001 (6 entries) -----------------------------------------
 {
 pilot_id: 'PIL-001',
 project_id: 'P-001',
 pilot_nama: 'Andi Pratama',
 pilot_avatar: '/images/avatars/Avatar 1.jpg',
 siaga_verified: true,
 rating: 4.8,
 harga: 18_500_000,
 estimasi_hari: 5,
 drone_type: 'DJI Matrice 300',
 portfolio_thumbs: [
 '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 '/images/services-categories/Jembatan___Jalan_Tol_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-002',
 project_id: 'P-001',
 pilot_nama: 'Budi Santoso',
 pilot_avatar: '/images/avatars/Avatar 2.jpg',
 siaga_verified: true,
 rating: 4.5,
 harga: 21_000_000,
 estimasi_hari: 4,
 drone_type: 'DJI Mavic 3 Enterprise',
 portfolio_thumbs: [
 '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-003',
 project_id: 'P-001',
 pilot_nama: 'Citra Lestari',
 pilot_avatar: '/images/avatars/Avatar 3.jpg',
 siaga_verified: false,
 rating: 4.1,
 harga: 16_200_000,
 estimasi_hari: 7,
 drone_type: 'Autel EVO II Pro',
 portfolio_thumbs: [
 '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-004',
 project_id: 'P-001',
 pilot_nama: 'Dewi Anjani',
 pilot_avatar: '/images/avatars/Avatar 4.jpg',
 siaga_verified: true,
 rating: 3.4,
 harga: 14_750_000,
 estimasi_hari: 8,
 drone_type: 'DJI Phantom 4 RTK',
 portfolio_thumbs: [
 '/images/services-categories/Bendungan___Irigasi_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-005',
 project_id: 'P-001',
 pilot_nama: 'Eko Wibowo',
 pilot_avatar: '/images/avatars/Avatar 5.jpg',
 siaga_verified: false,
 rating: 2.8,
 harga: 12_900_000,
 estimasi_hari: 9,
 drone_type: 'DJI Mavic 2 Pro',
 portfolio_thumbs: [
 '/images/services-categories/Solar_Panel_Farm_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-006',
 project_id: 'P-001',
 pilot_nama: 'Faisal Rahman',
 pilot_avatar: '/images/avatars/Avatar 6.jpg',
 // Below threshold rating < 2 — wajib selalu ter-hide oleh eligibleBids().
 siaga_verified: false,
 rating: 1.6,
 harga: 9_500_000,
 estimasi_hari: 12,
 drone_type: 'DJI Mini 3 Pro',
 portfolio_thumbs: [
 '/images/services-categories/Konstruksi_Tinggi___Crane_300kb.jpg',
 ],
 },

 // ---- Project P-002 (5 entries) -----------------------------------------
 {
 pilot_id: 'PIL-007',
 project_id: 'P-002',
 pilot_nama: 'Gita Saraswati',
 pilot_avatar: '/images/avatars/Avatar 7.jpg',
 siaga_verified: true,
 rating: 4.9,
 harga: 32_500_000,
 estimasi_hari: 6,
 drone_type: 'DJI Matrice 350 RTK',
 portfolio_thumbs: [
 '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
 '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-008',
 project_id: 'P-002',
 pilot_nama: 'Hadi Kurniawan',
 pilot_avatar: '/images/avatars/Avatar 8.jpg',
 siaga_verified: true,
 rating: 4.3,
 harga: 28_000_000,
 estimasi_hari: 7,
 drone_type: 'DJI Matrice 300',
 portfolio_thumbs: [
 '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-009',
 project_id: 'P-002',
 pilot_nama: 'Indah Permata',
 pilot_avatar: '/images/avatars/Avatar 9.jpg',
 siaga_verified: false,
 rating: 3.9,
 harga: 24_500_000,
 estimasi_hari: 8,
 drone_type: 'Autel EVO II Pro',
 portfolio_thumbs: [
 '/images/services-categories/Bendungan___Irigasi_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-010',
 project_id: 'P-002',
 pilot_nama: 'Joko Susilo',
 pilot_avatar: '/images/avatars/Avatar 10.jpg',
 siaga_verified: false,
 rating: 2.5,
 harga: 19_750_000,
 estimasi_hari: 10,
 drone_type: 'DJI Phantom 4 RTK',
 portfolio_thumbs: [
 '/images/services-categories/Solar_Panel_Farm_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-011',
 project_id: 'P-002',
 pilot_nama: 'Kartika Wulandari',
 pilot_avatar: '/images/avatars/Avatar 1.jpg',
 siaga_verified: true,
 rating: 4.6,
 harga: 30_200_000,
 estimasi_hari: 6,
 drone_type: 'DJI Mavic 3 Enterprise',
 portfolio_thumbs: [
 '/images/services-categories/Pipa_Migas___Kilang_300kb.jpg',
 ],
 },

 // ---- Project P-003 (5 entries) -----------------------------------------
 {
 pilot_id: 'PIL-012',
 project_id: 'P-003',
 pilot_nama: 'Lukman Hakim',
 pilot_avatar: '/images/avatars/Avatar 2.jpg',
 siaga_verified: true,
 rating: 4.7,
 harga: 22_800_000,
 estimasi_hari: 5,
 drone_type: 'DJI Matrice 300',
 portfolio_thumbs: [
 '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-013',
 project_id: 'P-003',
 pilot_nama: 'Maya Andini',
 pilot_avatar: '/images/avatars/Avatar 3.jpg',
 siaga_verified: false,
 rating: 4.0,
 harga: 19_500_000,
 estimasi_hari: 7,
 drone_type: 'Autel EVO II Pro',
 portfolio_thumbs: [
 '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-014',
 project_id: 'P-003',
 pilot_nama: 'Nanda Pratiwi',
 pilot_avatar: '/images/avatars/Avatar 4.jpg',
 siaga_verified: true,
 rating: 4.2,
 harga: 20_400_000,
 estimasi_hari: 6,
 drone_type: 'DJI Mavic 3 Enterprise',
 portfolio_thumbs: [
 '/images/services-categories/Konstruksi_Tinggi___Crane_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-015',
 project_id: 'P-003',
 pilot_nama: 'Oka Mahendra',
 pilot_avatar: '/images/avatars/Avatar 5.jpg',
 siaga_verified: false,
 rating: 3.2,
 harga: 17_300_000,
 estimasi_hari: 9,
 drone_type: 'DJI Phantom 4 RTK',
 portfolio_thumbs: [
 '/images/services-categories/Bendungan___Irigasi_300kb.jpg',
 ],
 },
 {
 pilot_id: 'PIL-016',
 project_id: 'P-003',
 pilot_nama: 'Putri Maharani',
 pilot_avatar: '/images/avatars/Avatar 6.jpg',
 siaga_verified: true,
 rating: 4.4,
 harga: 21_750_000,
 estimasi_hari: 6,
 drone_type: 'DJI Matrice 300',
 portfolio_thumbs: [
 '/images/services-categories/Tower_SUTET___Transmisi_300kb.jpg',
 ],
 },
];

// ---------------------------------------------------------------------------
// Activities — 10 entries dengan timestamp ISO datetime.
// ---------------------------------------------------------------------------

const activities = [
 {
 id: 'ACT-001',
 type: 'bid_received',
 description: 'Andi Pratama mengajukan penawaran untuk Inspeksi SUTET Bandung Selatan',
 timestamp: '2026-01-15T09:42:00+07:00',
 is_new: true,
 },
 {
 id: 'ACT-002',
 type: 'asset_alert',
 description: 'Aset Kilang Cilacap Unit 3 memerlukan inspeksi ulang (status kritis)',
 timestamp: '2026-01-15T08:15:00+07:00',
 is_new: true,
 },
 {
 id: 'ACT-003',
 type: 'report_ready',
 description: 'Laporan inspeksi Survei Tower Transmisi Surabaya siap diunduh',
 timestamp: '2026-01-14T17:05:00+07:00',
 is_new: true,
 },
 {
 id: 'ACT-004',
 type: 'pilot_uploaded',
 description: 'Citra Lestari mengunggah foto inspeksi Jembatan Kabel Suramadu Sektor B',
 timestamp: '2026-01-14T14:30:00+07:00',
 is_new: false,
 },
 {
 id: 'ACT-005',
 type: 'bid_received',
 description: 'Gita Saraswati mengajukan penawaran untuk Audit Pipa Migas Cilacap',
 timestamp: '2026-01-14T11:20:00+07:00',
 is_new: false,
 },
 {
 id: 'ACT-006',
 type: 'project_completed',
 description: 'Proyek Inspeksi Gardu Induk Cikarang berhasil diselesaikan',
 timestamp: '2026-01-13T16:45:00+07:00',
 is_new: false,
 },
 {
 id: 'ACT-007',
 type: 'bid_received',
 description: 'Hadi Kurniawan mengajukan penawaran untuk Audit Pipa Migas Cilacap',
 timestamp: '2026-01-13T10:12:00+07:00',
 is_new: false,
 },
 {
 id: 'ACT-008',
 type: 'asset_alert',
 description: 'Aset SUTET Bandung Utara berstatus kritis — pulse marker aktif',
 timestamp: '2026-01-12T15:00:00+07:00',
 is_new: false,
 },
 {
 id: 'ACT-009',
 type: 'pilot_uploaded',
 description: 'Lukman Hakim mengunggah dokumentasi tower transmisi Surabaya',
 timestamp: '2026-01-12T09:50:00+07:00',
 is_new: false,
 },
 {
 id: 'ACT-010',
 type: 'report_ready',
 description: 'Laporan inspeksi pendahuluan Pipa Migas Balongan siap direview',
 timestamp: '2026-01-11T18:25:00+07:00',
 is_new: false,
 },
];

// ---------------------------------------------------------------------------
// Quick Stats Footer
// ---------------------------------------------------------------------------

const quick_stats = {
 total_hemat_rp: 1_250_000_000,
 total_pilot_kerjasama: 47,
 rata_rata_waktu_bidding_hari: 5,
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

const notifications = {
 unread_count: 3,
};

// ---------------------------------------------------------------------------
// Export — deeply frozen single source of truth.
// ---------------------------------------------------------------------------

export const mockData = deepFreeze({
 perusahaan,
 overview_metrics,
 assets,
 proyek_aktif,
 bids,
 activities,
 quick_stats,
 notifications,
});

export default mockData;
