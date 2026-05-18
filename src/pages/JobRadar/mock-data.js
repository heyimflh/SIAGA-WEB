/**
 * Mock Data Module — Single Source of Truth for Job Radar Page
 * 
 * Semua data proyek inspeksi UAV berasal dari file ini.
 * Jumlah pin, list proyek, stats HUD, dan filter results
 * semuanya dihitung dari array ini.
 * 
 * Feature: job-radar-page
 * Requirements: 10.1–10.26
 */

const projects = [
  {
    id: 'proj-001',
    nama: 'Inspeksi SUTET Bandung Utara',
    jenis_infrastruktur: 'SUTET',
    nilai_kontrak: 350000000,
    lokasi: { lat: -6.85, lng: 107.61, kota: 'Bandung', provinsi: 'Jawa Barat' },
    deadline: '2026-03-15',
    status: 'urgent',
    jumlah_bidder: 5,
    deskripsi: 'Inspeksi visual dan termal jalur SUTET 150kV sepanjang 12km di area pegunungan Bandung Utara. Diperlukan drone dengan kamera termal dan kemampuan terbang di ketinggian 500m.',
    client_nama: 'PT PLN Persero',
  },
  {
    id: 'proj-002',
    nama: 'Survey Jembatan Suramadu',
    jenis_infrastruktur: 'Jembatan',
    nilai_kontrak: 780000000,
    lokasi: { lat: -7.19, lng: 112.78, kota: 'Surabaya', provinsi: 'Jawa Timur' },
    deadline: '2026-04-20',
    status: 'open',
    jumlah_bidder: 8,
    deskripsi: 'Survey kondisi struktural Jembatan Suramadu menggunakan drone LiDAR dan kamera resolusi tinggi. Fokus pada kabel penahan dan pilar utama.',
    client_nama: 'Kementerian PUPR',
  },
  {
    id: 'proj-003',
    nama: 'Monitoring Kilang Cilacap',
    jenis_infrastruktur: 'Kilang',
    nilai_kontrak: 1200000000,
    lokasi: { lat: -7.73, lng: 109.01, kota: 'Cilacap', provinsi: 'Jawa Tengah' },
    deadline: '2026-02-28',
    status: 'deadline_dekat',
    jumlah_bidder: 3,
    deskripsi: 'Monitoring kebocoran pipa dan inspeksi tangki penyimpanan di area kilang minyak Cilacap. Memerlukan drone anti-ledak dengan sensor gas.',
    client_nama: 'PT Pertamina',
  },
  {
    id: 'proj-004',
    nama: 'Inspeksi Solar Panel Farm Kupang',
    jenis_infrastruktur: 'Solar Panel',
    nilai_kontrak: 450000000,
    lokasi: { lat: -10.17, lng: 123.58, kota: 'Kupang', provinsi: 'Nusa Tenggara Timur' },
    deadline: '2026-05-10',
    status: 'open',
    jumlah_bidder: 2,
    deskripsi: 'Inspeksi termal panel surya untuk mendeteksi hotspot dan kerusakan sel pada farm 50MW. Area seluas 80 hektar.',
    client_nama: 'PT PLN Nusantara Power',
  },
  {
    id: 'proj-005',
    nama: 'Survey Bendungan Jatiluhur',
    jenis_infrastruktur: 'Bendungan',
    nilai_kontrak: 920000000,
    lokasi: { lat: -6.53, lng: 107.38, kota: 'Purwakarta', provinsi: 'Jawa Barat' },
    deadline: '2026-06-01',
    status: 'open',
    jumlah_bidder: 6,
    deskripsi: 'Survey topografi dan inspeksi struktural Bendungan Jatiluhur menggunakan drone photogrammetry. Termasuk pemodelan 3D dam body.',
    client_nama: 'Perum Jasa Tirta II',
  },
  {
    id: 'proj-006',
    nama: 'Inspeksi Tower Telkom Kalimantan',
    jenis_infrastruktur: 'Tower',
    nilai_kontrak: 180000000,
    lokasi: { lat: -1.24, lng: 116.85, kota: 'Balikpapan', provinsi: 'Kalimantan Timur' },
    deadline: '2026-03-30',
    status: 'open',
    jumlah_bidder: 4,
    deskripsi: 'Inspeksi visual 25 tower telekomunikasi di area Balikpapan-Samarinda. Pengecekan kondisi antena, kabel, dan struktur tower.',
    client_nama: 'PT Telkom Indonesia',
  },
  {
    id: 'proj-007',
    nama: 'Monitoring SUTET Sumatera Selatan',
    jenis_infrastruktur: 'SUTET',
    nilai_kontrak: 520000000,
    lokasi: { lat: -3.32, lng: 104.79, kota: 'Palembang', provinsi: 'Sumatera Selatan' },
    deadline: '2026-04-15',
    status: 'open',
    jumlah_bidder: 7,
    deskripsi: 'Monitoring jalur transmisi 275kV Palembang-Jambi sepanjang 45km. Deteksi vegetasi yang mengganggu dan kerusakan isolator.',
    client_nama: 'PT PLN Persero',
  },
  {
    id: 'proj-008',
    nama: 'Inspeksi Jembatan Mahakam',
    jenis_infrastruktur: 'Jembatan',
    nilai_kontrak: 650000000,
    lokasi: { lat: -0.49, lng: 117.15, kota: 'Samarinda', provinsi: 'Kalimantan Timur' },
    deadline: '2026-03-01',
    status: 'urgent',
    jumlah_bidder: 2,
    deskripsi: 'Inspeksi darurat Jembatan Mahakam IV setelah laporan retak pada pilar. Diperlukan drone dengan kamera zoom 30x dan LiDAR.',
    client_nama: 'Dinas PU Kaltim',
  },
  {
    id: 'proj-009',
    nama: 'Survey Kilang LNG Bontang',
    jenis_infrastruktur: 'Kilang',
    nilai_kontrak: 1800000000,
    lokasi: { lat: 0.12, lng: 117.48, kota: 'Bontang', provinsi: 'Kalimantan Timur' },
    deadline: '2026-07-20',
    status: 'open',
    jumlah_bidder: 4,
    deskripsi: 'Survey komprehensif fasilitas LNG Bontang meliputi inspeksi pipa, tangki, dan flare stack. Proyek berdurasi 3 bulan.',
    client_nama: 'PT Badak NGL',
  },
  {
    id: 'proj-010',
    nama: 'Inspeksi Bendungan Bili-Bili',
    jenis_infrastruktur: 'Bendungan',
    nilai_kontrak: 680000000,
    lokasi: { lat: -5.28, lng: 119.62, kota: 'Gowa', provinsi: 'Sulawesi Selatan' },
    deadline: '2026-05-25',
    status: 'open',
    jumlah_bidder: 3,
    deskripsi: 'Inspeksi kondisi spillway dan dam body Bendungan Bili-Bili. Termasuk survey sedimentasi menggunakan bathymetric drone.',
    client_nama: 'Balai Besar Wilayah Sungai Pompengan-Jeneberang',
  },
  {
    id: 'proj-011',
    nama: 'Monitoring Solar Farm Likupang',
    jenis_infrastruktur: 'Solar Panel',
    nilai_kontrak: 380000000,
    lokasi: { lat: 1.58, lng: 125.05, kota: 'Likupang', provinsi: 'Sulawesi Utara' },
    deadline: '2026-04-05',
    status: 'deadline_dekat',
    jumlah_bidder: 1,
    deskripsi: 'Monitoring performa dan deteksi kerusakan panel surya farm 21MW di Likupang. Inspeksi termal dan visual.',
    client_nama: 'PT Vena Energy',
  },
  {
    id: 'proj-012',
    nama: 'Inspeksi Tower BTS Papua',
    jenis_infrastruktur: 'Tower',
    nilai_kontrak: 250000000,
    lokasi: { lat: -2.53, lng: 140.72, kota: 'Jayapura', provinsi: 'Papua' },
    deadline: '2026-06-15',
    status: 'open',
    jumlah_bidder: 1,
    deskripsi: 'Inspeksi 15 tower BTS di area pegunungan Jayapura. Akses darat sulit, memerlukan drone long-range dengan endurance 45 menit.',
    client_nama: 'PT XL Axiata',
  },
  {
    id: 'proj-013',
    nama: 'Survey SUTET Crossing Selat Sunda',
    jenis_infrastruktur: 'SUTET',
    nilai_kontrak: 2000000000,
    lokasi: { lat: -6.10, lng: 105.85, kota: 'Cilegon', provinsi: 'Banten' },
    deadline: '2026-08-30',
    status: 'open',
    jumlah_bidder: 9,
    deskripsi: 'Survey jalur transmisi 500kV crossing Selat Sunda. Proyek prestisius dengan kebutuhan drone maritime-grade dan pilot berpengalaman.',
    client_nama: 'PT PLN Persero',
  },
  {
    id: 'proj-014',
    nama: 'Inspeksi Jembatan Barelang',
    jenis_infrastruktur: 'Jembatan',
    nilai_kontrak: 420000000,
    lokasi: { lat: 1.01, lng: 104.05, kota: 'Batam', provinsi: 'Kepulauan Riau' },
    deadline: '2026-01-15',
    status: 'closed',
    jumlah_bidder: 6,
    deskripsi: 'Inspeksi rutin 6 jembatan penghubung Barelang. Proyek telah selesai.',
    client_nama: 'BP Batam',
  },
  {
    id: 'proj-015',
    nama: 'Monitoring Kilang Dumai',
    jenis_infrastruktur: 'Kilang',
    nilai_kontrak: 950000000,
    lokasi: { lat: 1.68, lng: 101.45, kota: 'Dumai', provinsi: 'Riau' },
    deadline: '2026-01-30',
    status: 'closed',
    jumlah_bidder: 5,
    deskripsi: 'Monitoring fasilitas kilang minyak Dumai. Proyek telah selesai dan laporan diserahkan.',
    client_nama: 'PT Pertamina',
  },
  {
    id: 'proj-016',
    nama: 'Inspeksi Bendungan Saguling',
    jenis_infrastruktur: 'Bendungan',
    nilai_kontrak: 550000000,
    lokasi: { lat: -6.92, lng: 107.37, kota: 'Cimahi', provinsi: 'Jawa Barat' },
    deadline: '2026-03-20',
    status: 'deadline_dekat',
    jumlah_bidder: 4,
    deskripsi: 'Inspeksi tahunan Bendungan Saguling meliputi dam body, spillway, dan area genangan. Photogrammetry dan termal.',
    client_nama: 'PT Indonesia Power',
  },
  {
    id: 'proj-017',
    nama: 'Survey Tower Transmisi Sulawesi',
    jenis_infrastruktur: 'Tower',
    nilai_kontrak: 320000000,
    lokasi: { lat: -0.90, lng: 120.46, kota: 'Palu', provinsi: 'Sulawesi Tengah' },
    deadline: '2026-05-15',
    status: 'open',
    jumlah_bidder: 2,
    deskripsi: 'Survey kondisi 30 tower transmisi pasca-gempa di area Palu-Donggala. Pengecekan fondasi dan kelurusan tower.',
    client_nama: 'PT PLN Persero',
  },
  {
    id: 'proj-018',
    nama: 'Inspeksi Solar Panel Cirata',
    jenis_infrastruktur: 'Solar Panel',
    nilai_kontrak: 1500000000,
    lokasi: { lat: -6.72, lng: 107.36, kota: 'Purwakarta', provinsi: 'Jawa Barat' },
    deadline: '2026-09-01',
    status: 'open',
    jumlah_bidder: 11,
    deskripsi: 'Inspeksi floating solar panel terbesar di Asia Tenggara (145MW) di Waduk Cirata. Memerlukan drone waterproof.',
    client_nama: 'PT PLN Nusantara Power',
  },
];

/**
 * Compute stats from a given projects array.
 * Stats selalu dihitung dari data yang diberikan, bukan hardcoded.
 */
export function computeStatsFromSource(projectList) {
  const aktif = projectList.filter(p => p.status !== 'closed').length;
  const open = projectList.filter(p => p.status === 'open').length;
  const urgent = projectList.filter(p => p.status === 'urgent').length;
  return { aktif, open, urgent };
}

/**
 * Get project by ID.
 */
export function getProjectById(id) {
  return projects.find(p => p.id === id) || null;
}

/**
 * Get unique locations from projects for autocomplete.
 */
export function getProjectLocations(projectList) {
  const locations = new Set();
  projectList.forEach(p => {
    locations.add(p.lokasi.kota);
    locations.add(p.lokasi.provinsi);
  });
  return [...locations].sort();
}

export default Object.freeze(projects);
