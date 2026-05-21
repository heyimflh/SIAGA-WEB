/**
 * mock-data.js — Single source of truth untuk seluruh data Pilot Dashboard.
 *
 * Semua section membaca dari sini agar angka antar-section konsisten.
 * Tidak ada API call. Data bersifat statis dan tidak boleh dimutasi.
 *
 * Feature: pilot-dashboard
 * Validates: Requirements 14
 */

export const mockData = Object.freeze({
 pilot_profile: {
 nama: 'Rizky',
 email: 'rizky@siaga.id',
 avatar: '/images/avatars/Avatar 1.jpg',
 is_verified: true,
 rating_avg: 4.8,
 total_reviews: 24,
 drone_type: 'DJI Matrice 300 RTK',
 response_rate: '98%',
 availability_status: 'Available for Mission',
 },

 bids: [
 {
 id: 'bid-001',
 project_id: 'proj-001',
 nama_proyek: 'Inspeksi Jembatan Barelang',
 jenis_infrastruktur: 'Jembatan',
 lokasi: 'Batam, Kepulauan Riau',
 harga_bid: 45000000,
 estimasi_hari: 5,
 status: 'pending',
 tanggal_submit: '2026-01-10',
 },
 {
 id: 'bid-002',
 project_id: 'proj-002',
 nama_proyek: 'Inspeksi SUTET Bandung Selatan',
 jenis_infrastruktur: 'Tower SUTET',
 lokasi: 'Bandung, Jawa Barat',
 harga_bid: 38000000,
 estimasi_hari: 4,
 status: 'diterima',
 tanggal_submit: '2026-01-08',
 },
 {
 id: 'bid-003',
 project_id: 'proj-003',
 nama_proyek: 'Pemetaan Bendungan Gajah Mungkur',
 jenis_infrastruktur: 'Bendungan',
 lokasi: 'Wonogiri, Jawa Tengah',
 harga_bid: 52000000,
 estimasi_hari: 7,
 status: 'pending',
 tanggal_submit: '2026-01-12',
 },
 {
 id: 'bid-004',
 project_id: 'proj-004',
 nama_proyek: 'Monitoring Jalan Tol Semarang-Solo',
 jenis_infrastruktur: 'Jalan Tol',
 lokasi: 'Semarang - Solo, Jawa Tengah',
 harga_bid: 62000000,
 estimasi_hari: 8,
 status: 'ditolak',
 tanggal_submit: '2026-01-05',
 },
 {
 id: 'bid-005',
 project_id: 'proj-005',
 nama_proyek: 'Inspeksi Tower Telekomunikasi Surakarta',
 jenis_infrastruktur: 'Tower Telekomunikasi',
 lokasi: 'Surakarta, Jawa Tengah',
 harga_bid: 28000000,
 estimasi_hari: 3,
 status: 'pending',
 tanggal_submit: '2026-01-14',
 },
 ],

 proyek_berjalan: [
 {
 id: 'proj-002',
 nama_proyek: 'Inspeksi SUTET Bandung Selatan',
 lokasi: 'Bandung, Jawa Barat',
 client_nama: 'PT PLN Persero',
 jenis_infrastruktur: 'Tower SUTET',
 mission_status: 'Inspection In Progress',
 progress_percentage: 65,
 deadline: '2026-01-20',
 milestones: [
 { key: 'posted', label: 'Posted', status: 'completed' },
 { key: 'bidding_open', label: 'Bidding', status: 'completed' },
 { key: 'pilot_selected', label: 'Pilot Selected', status: 'completed' },
 { key: 'inspection_in_progress', label: 'Flight Mission', status: 'in_progress' },
 { key: 'report_ready', label: 'Report Ready', status: 'upcoming' },
 ],
 },
 {
 id: 'proj-003',
 nama_proyek: 'Pemetaan Bendungan Gajah Mungkur',
 lokasi: 'Wonogiri, Jawa Tengah',
 client_nama: 'Kementerian PUPR',
 jenis_infrastruktur: 'Bendungan',
 mission_status: 'Pilot Selected',
 progress_percentage: 35,
 deadline: '2026-01-25',
 milestones: [
 { key: 'posted', label: 'Posted', status: 'completed' },
 { key: 'bidding_open', label: 'Bidding', status: 'completed' },
 { key: 'pilot_selected', label: 'Pilot Selected', status: 'in_progress' },
 { key: 'inspection_in_progress', label: 'Flight Mission', status: 'upcoming' },
 { key: 'report_ready', label: 'Report Ready', status: 'upcoming' },
 ],
 },
 ],

 earnings: {
 total_kumulatif: 287500000,
 bulan_ini: 52000000,
 bulan_lalu: 44000000,
 chart_data: [
 { bulan: 'Agu', nilai: 32000000 },
 { bulan: 'Sep', nilai: 41000000 },
 { bulan: 'Okt', nilai: 38000000 },
 { bulan: 'Nov', nilai: 44000000 },
 { bulan: 'Des', nilai: 44000000 },
 { bulan: 'Jan', nilai: 52000000 },
 ],
 },

 payments: [
 { id: 'pay-001', proyek: 'Inspeksi SUTET Bandung Selatan', client: 'PT PLN Persero', nilai: 38000000, status: 'escrow', tanggal: '2026-01-08' },
 { id: 'pay-002', proyek: 'Monitoring Jalan Tol Semarang-Solo', client: 'PT Jasa Marga', nilai: 62000000, status: 'dibayar', tanggal: '2025-12-20' },
 { id: 'pay-003', proyek: 'Inspeksi Jembatan Mahakam', client: 'Dinas PU Kaltim', nilai: 35000000, status: 'dibayar', tanggal: '2025-12-05' },
 { id: 'pay-004', proyek: 'Pemetaan Bendungan Gajah Mungkur', client: 'Kementerian PUPR', nilai: 52000000, status: 'pending', tanggal: '2026-01-12' },
 { id: 'pay-005', proyek: 'Survey Tower BTS Yogyakarta', client: 'PT Telkomsel', nilai: 28000000, status: 'dibayar', tanggal: '2025-11-18' },
 ],

 reviews: [
 {
 id: 'rev-001',
 client_nama: 'PT Jasa Marga',
 client_avatar: '/images/avatars/Avatar 7.jpg',
 rating: 5,
 teks: 'Pilot sangat profesional, data inspeksi lengkap dan akurat. Deadline terpenuhi dengan baik. Sangat direkomendasikan untuk proyek infrastruktur besar.',
 tanggal: '2025-12-22',
 },
 {
 id: 'rev-002',
 client_nama: 'Dinas PU Kaltim',
 client_avatar: '/images/avatars/Avatar 8.jpg',
 rating: 5,
 teks: 'Hasil orthomosaic sangat detail, point cloud akurat. Komunikasi responsif dan proaktif memberikan update progress.',
 tanggal: '2025-12-08',
 },
 {
 id: 'rev-003',
 client_nama: 'PT Telkomsel',
 client_avatar: '/images/avatars/Avatar 9.jpg',
 rating: 4,
 teks: 'Kualitas data inspeksi tower sangat baik. Sedikit keterlambatan karena cuaca, tapi overall memuaskan.',
 tanggal: '2025-11-20',
 },
 ],

 workspace_files: [
 { id: 'wf-001', project_id: 'proj-002', nama_file: 'SUTET_BDG_RAW_001.dng', ukuran: 48000000, tipe: 'RAW Photo', tanggal_upload: '2026-01-15', thumbnail: null },
 { id: 'wf-002', project_id: 'proj-002', nama_file: 'SUTET_BDG_Thermal_001.tif', ukuran: 125000000, tipe: 'Thermal Data', tanggal_upload: '2026-01-15', thumbnail: null },
 { id: 'wf-003', project_id: 'proj-002', nama_file: 'SUTET_BDG_Flight_4K.mp4', ukuran: 320000000, tipe: 'Video 4K', tanggal_upload: '2026-01-14', thumbnail: null },
 ],

 notifications: {
 unread_count: 3,
 },
});
