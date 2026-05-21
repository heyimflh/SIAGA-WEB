/**
 * Timeline data for How It Works page — SIAGA Mission Control Journey.
 * Each step represents a phase in the SIAGA inspection workflow.
 */
export const timelineSteps = [
 {
 id: '01',
 label: 'POST PROJECT',
 title: 'Posting Proyek Inspeksi',
 description:
 'Client mengisi kebutuhan inspeksi seperti lokasi, tipe aset, jadwal, dan output laporan yang dibutuhkan. Sistem SIAGA menyusun project brief secara otomatis.',
 bullets: [
 'Pilih kategori infrastruktur',
 'Upload brief awal',
 'Tentukan jadwal inspeksi',
 'Sistem membuat project brief otomatis',
 ],
 cta: { text: 'Buat Project Brief', href: '/register?role=client' },
 },
 {
 id: '02',
 label: 'SELECT PILOT',
 title: 'Pilih Pilot Tersertifikasi',
 description:
 'SIAGA membantu menampilkan pilot UAV yang sesuai dengan kebutuhan proyek berdasarkan lokasi, pengalaman, rating, dan status verifikasi.',
 bullets: [
 'Pilot terverifikasi SIAGA',
 'Rating transparan dari klien',
 'Matching lebih cepat',
 'Komunikasi terpusat',
 ],
 cta: { text: 'Lihat Pilot', href: '/pilots' },
 },
 {
 id: '03',
 label: 'LIVE INSPECTION',
 title: 'Pantau Inspeksi Secara Real-Time',
 description:
 'Client dapat melihat status misi, dokumentasi lapangan, titik temuan, dan progres inspeksi tanpa harus menunggu laporan manual dari pilot.',
 bullets: [
 'Live progress tracking',
 'Dokumentasi lapangan otomatis',
 'Marker potensi kerusakan',
 'Log aktivitas inspeksi',
 ],
 cta: null,
 },
 {
 id: '04',
 label: 'AI REPORT',
 title: 'Laporan Profesional Siap Diunduh',
 description:
 'Setelah inspeksi selesai, sistem membantu menyusun laporan rapi yang dapat digunakan untuk dokumentasi, evaluasi, dan tindak lanjut teknis.',
 bullets: [
 'Format laporan profesional',
 'Foto dan titik temuan',
 'Ringkasan kondisi aset',
 'Siap diunduh sebagai PDF',
 ],
 cta: { text: 'Lihat Contoh Laporan', href: '/how-it-works#sample-report' },
 },
];

export const trustLayerCards = [
 {
 id: 'verified-pilot',
 icon: 'Shield',
 title: 'Verified Pilot Layer',
 description: 'Setiap pilot memiliki profil lengkap, rating dari klien sebelumnya, spesialisasi, dan status verifikasi SIAGA.',
 },
 {
 id: 'escrow-safety',
 icon: 'Lock',
 title: 'Escrow & Payment Safety',
 description: 'Pembayaran lebih aman karena dana tidak langsung dilepas sebelum pekerjaan selesai dan laporan diterima.',
 },
 {
 id: 'data-pipeline',
 icon: 'Database',
 title: 'Inspection Data Pipeline',
 description: 'Foto, catatan, lokasi, progress, dan defect marker disusun menjadi data inspeksi terstruktur secara otomatis.',
 },
 {
 id: 'report-generator',
 icon: 'FileText',
 title: 'Report Generator',
 description: 'Data inspeksi diolah menjadi laporan rapi berstandar profesional, bukan sekadar file mentah tanpa format.',
 },
];

export const roleBenefits = [
 {
 id: 'client',
 title: 'Untuk Client',
 features: [
 'Posting proyek inspeksi',
 'Cari pilot tersertifikasi',
 'Pantau progres real-time',
 'Unduh laporan profesional',
 ],
 cta: { text: 'Mulai sebagai Client', href: '/register?role=client' },
 accent: 'cyan',
 },
 {
 id: 'pilot',
 title: 'Untuk Pilot UAV',
 features: [
 'Temukan proyek inspeksi',
 'Kelola misi lapangan',
 'Upload hasil inspeksi',
 'Bangun reputasi profesional',
 ],
 cta: { text: 'Gabung sebagai Pilot', href: '/register?role=pilot' },
 accent: 'blue',
 },
 {
 id: 'infrastructure',
 title: 'Untuk Infrastruktur',
 features: [
 'Dokumentasi lebih rapi',
 'Monitoring lebih cepat',
 'Laporan mudah dianalisis',
 'Proses inspeksi transparan',
 ],
 cta: { text: 'Lihat Contoh Laporan', href: '/how-it-works#sample-report' },
 accent: 'amber',
 },
];
