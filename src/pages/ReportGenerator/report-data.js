/**
 * Report Data Module — data source for Report Generator Page.
 * Provides completed projects with enriched inspection data and images.
 * Local data layer — does NOT modify global project data.
 *
 * Feature: report-generator
 */

import projectDetailData from '../ProjectDetail/project-detail-data.js';

// ─── IMAGE MAPPING ───────────────────────────────────────────────────────────

const PROJECT_IMAGES = {
 'proj-014': {
 coverImage: '/images/projects/barelang-cover-compressed.jpg',
 mapPreviewImage: '/images/projects/barelang-map-compressed.jpg',
 galleryImages: [
 '/images/projects/barelang-gallery_1-compressed.jpg',
 '/images/projects/barelang-gallery_2-compressed.jpg',
 '/images/projects/barelang-gallery_3-compressed.jpg',
 ],
 },
 'rpt-sutet': {
 coverImage: '/images/projects/sutet_bandung-cover-compressed.jpg',
 mapPreviewImage: '/images/projects/sutet_bandung-map-compressed.jpg',
 galleryImages: [
 '/images/projects/sutet_bandung-gallery_1-compressed.jpg',
 '/images/projects/sutet_bandung-gallery_2-compressed.jpg',
 '/images/projects/sutet_bandung-gallery_3-compressed.jpg',
 ],
 },
 'rpt-bendungan': {
 coverImage: '/images/projects/bendungan_gajahmungkur-cover-compressed.jpg',
 mapPreviewImage: '/images/projects/bendungan_gajahmungkur-map-compressed.jpg',
 galleryImages: [
 '/images/projects/bendungan_gajahmungkur-gallery_1-compressed.jpg',
 '/images/projects/bendungan_gajahmungkur-gallery_2-compressed.jpg',
 ],
 },
 'rpt-tol': {
 coverImage: '/images/projects/tol_semarangsolo-cover-compressed.jpg',
 mapPreviewImage: '/images/projects/tol_semarangsolo-map-compressed.jpg',
 galleryImages: [
 '/images/projects/tol_semarangsolo-gallery_1-compressed.jpg',
 ],
 },
 'rpt-tower': {
 coverImage: '/images/projects/tower_surakarta-cover-compressed.jpg',
 mapPreviewImage: '/images/projects/sutet_bandung-map-compressed.jpg',
 galleryImages: [
 '/images/projects/sutet_bandung-gallery_1-compressed.jpg',
 '/images/projects/sutet_bandung-gallery_2-compressed.jpg',
 ],
 },
};

const DEFAULT_IMAGES = {
 coverImage: '/images/services-categories/Jembatan___Jalan_Tol_300kb.jpg',
 mapPreviewImage: '/images/projects/barelang-map-compressed.jpg',
 galleryImages: ['/images/projects/barelang-gallery_1-compressed.jpg'],
};

// ─── LOCAL COMPLETED PROJECTS (for demo) ─────────────────────────────────────

const LOCAL_COMPLETED_PROJECTS = [
 {
 id: 'rpt-sutet',
 nama: 'Inspeksi SUTET Bandung Selatan',
 jenis_infrastruktur: 'Jaringan Transmisi Listrik',
 lokasi: { lat: -6.95, lng: 107.63, kota: 'Bandung', provinsi: 'Jawa Barat' },
 status: 'completed',
 milestones: [
 { label: 'Posted', status: 'completed', date: '2025-08-01' },
 { label: 'Bidding Open', status: 'completed', date: '2025-08-05' },
 { label: 'Pilot Selected', status: 'completed', date: '2025-08-20' },
 { label: 'Inspection In Progress', status: 'completed', date: '2025-09-10' },
 { label: 'Report Ready', status: 'completed', date: '2025-10-05' },
 ],
 luas_area: 14.2,
 jumlah_titik_inspeksi: 12,
 deliverables: ['Foto RAW', 'Video 4K', 'Thermal Scan', 'Laporan PDF'],
 client_nama: 'PT PLN Persero',
 client_info: { nama: 'PT PLN Persero', rating: 4.8, proyek_selesai: 42, verified: true },
 bids: [{ pilot_nama: 'Andi Pratama', drone_type: 'DJI Matrice 300 RTK' }],
 },
 {
 id: 'rpt-bendungan',
 nama: 'Inspeksi Bendungan Gajah Mungkur',
 jenis_infrastruktur: 'Bendungan',
 lokasi: { lat: -7.72, lng: 110.92, kota: 'Wonogiri', provinsi: 'Jawa Tengah' },
 status: 'completed',
 milestones: [
 { label: 'Posted', status: 'completed', date: '2025-07-10' },
 { label: 'Bidding Open', status: 'completed', date: '2025-07-15' },
 { label: 'Pilot Selected', status: 'completed', date: '2025-08-01' },
 { label: 'Inspection In Progress', status: 'completed', date: '2025-08-20' },
 { label: 'Report Ready', status: 'completed', date: '2025-09-15' },
 ],
 luas_area: 22.0,
 jumlah_titik_inspeksi: 10,
 deliverables: ['Foto RAW', 'Video 4K', 'Point Cloud', 'Orthomosaic', 'Laporan PDF'],
 client_nama: 'Balai Besar Wilayah Sungai Bengawan Solo',
 client_info: { nama: 'BBWS Bengawan Solo', rating: 4.6, proyek_selesai: 18, verified: true },
 bids: [{ pilot_nama: 'Fajar Geospatial', drone_type: 'DJI Matrice 350 RTK + L2 LiDAR' }],
 },
 {
 id: 'rpt-tol',
 nama: 'Inspeksi Jalan Tol Semarang-Solo',
 jenis_infrastruktur: 'Jalan Tol',
 lokasi: { lat: -7.25, lng: 110.45, kota: 'Semarang', provinsi: 'Jawa Tengah' },
 status: 'completed',
 milestones: [
 { label: 'Posted', status: 'completed', date: '2025-09-01' },
 { label: 'Bidding Open', status: 'completed', date: '2025-09-05' },
 { label: 'Pilot Selected', status: 'completed', date: '2025-09-20' },
 { label: 'Inspection In Progress', status: 'completed', date: '2025-10-15' },
 { label: 'Report Ready', status: 'completed', date: '2025-11-10' },
 ],
 luas_area: 35.0,
 jumlah_titik_inspeksi: 8,
 deliverables: ['Foto RAW', 'Video 4K', 'Orthomosaic', 'Laporan PDF'],
 client_nama: 'PT Jasa Marga',
 client_info: { nama: 'PT Jasa Marga', rating: 4.7, proyek_selesai: 35, verified: true },
 bids: [{ pilot_nama: 'Budi Setiawan', drone_type: 'DJI Matrice 350 RTK' }],
 },
 {
 id: 'rpt-tower',
 nama: 'Inspeksi Menara Telekomunikasi Surakarta',
 jenis_infrastruktur: 'Menara Telekomunikasi',
 lokasi: { lat: -7.57, lng: 110.82, kota: 'Surakarta', provinsi: 'Jawa Tengah' },
 status: 'completed',
 milestones: [
 { label: 'Posted', status: 'completed', date: '2025-10-01' },
 { label: 'Bidding Open', status: 'completed', date: '2025-10-05' },
 { label: 'Pilot Selected', status: 'completed', date: '2025-10-18' },
 { label: 'Inspection In Progress', status: 'completed', date: '2025-11-01' },
 { label: 'Report Ready', status: 'completed', date: '2025-11-20' },
 ],
 luas_area: 2.5,
 jumlah_titik_inspeksi: 6,
 deliverables: ['Foto RAW', 'Video 4K', 'Thermal Scan', 'Laporan PDF'],
 client_nama: 'Telkom Indonesia',
 client_info: { nama: 'Telkom Indonesia', rating: 4.5, proyek_selesai: 28, verified: true },
 bids: [{ pilot_nama: 'Cahya Drone ID', drone_type: 'DJI Mavic 3T Enterprise' }],
 },
];

// ─── INSPECTION DATA ─────────────────────────────────────────────────────────

const INSPECTION_DATA = {
 'proj-014': {
 assetOwner: 'BP Batam', assetType: 'Jembatan Penghubung Pulau', assetCode: 'BRG-JMB-014',
 inspectionDate: '2025-12-15', inspectionArea: '6.2 Ha', droneModel: 'DJI Matrice 300 RTK',
 flightDuration: '4 jam 32 menit', photosCaptured: 847, gpsPoints: 9,
 criticalFindings: 3, moderateFindings: 5, safePoints: 14,
 overallRiskScore: 72, assetHealthIndex: 'B+', riskLevel: 'Medium-High',
 coveragePercentage: 94.7, pilotSignature: 'Andi Pratama, SIAGA Verified Pilot',
 mainCoordinates: [
 { lat: 1.00, lng: 104.03, label: 'Jembatan 1 Tengku Agung Sultanah Latifah' },
 { lat: 1.01, lng: 104.05, label: 'Jembatan 3 Tengku Fisabilillah' },
 { lat: 1.02, lng: 104.04, label: 'Jembatan 5 Habibie' },
 ],
 recommendations: [
 'Perbaikan segera retak struktur di Pier 3 East Segment',
 'Inspeksi lanjutan korosi kabel penahan Jembatan 5',
 'Monitoring berkala 3 bulan untuk expansion joint EJ-01',
 'Penggantian bearing pad pada Pilar Utama PU-02',
 ],
 findings: [
 { id: 'FDG-014-001', location: 'Pier 3 - East Segment', type: 'Retak rambut struktur beton', severity: 'High', condition: 'Perlu perbaikan segera', priority: 'P1', recommendation: 'Sealing crack dan pemeriksaan visual detail', image: '/images/projects/barelang-gallery_1-compressed.jpg' },
 { id: 'FDG-014-002', location: 'Kabel Penahan - Jembatan 5', type: 'Korosi permukaan kabel baja', severity: 'High', condition: 'Perlu inspeksi lanjutan', priority: 'P1', recommendation: 'Inspeksi NDT dan evaluasi kapasitas tarik', image: '/images/projects/barelang-gallery_2-compressed.jpg' },
 { id: 'FDG-014-003', location: 'Expansion Joint EJ-01', type: 'Deformasi seal karet', severity: 'Medium', condition: 'Monitoring berkala', priority: 'P2', recommendation: 'Penggantian seal pada maintenance berikutnya', image: '/images/projects/barelang-gallery_3-compressed.jpg' },
 { id: 'FDG-014-004', location: 'Pilar Utama PU-02', type: 'Aus bearing pad', severity: 'Medium', condition: 'Monitoring berkala', priority: 'P2', recommendation: 'Pertimbangkan penggantian bearing pad', image: '/images/projects/barelang-gallery_1-compressed.jpg' },
 { id: 'FDG-014-005', location: 'Deck Section - Jembatan 2', type: 'Spalling beton ringan', severity: 'Low', condition: 'Aman dengan monitoring', priority: 'P3', recommendation: 'Patching beton pada maintenance rutin', image: '/images/projects/barelang-gallery_2-compressed.jpg' },
 ],
 },
 'rpt-sutet': {
 assetOwner: 'PT PLN Persero', assetType: 'Saluran Udara Tegangan Ekstra Tinggi', assetCode: 'PLN-SUTET-BDG-07',
 inspectionDate: '2025-10-05', inspectionArea: '14.2 Ha', droneModel: 'DJI Matrice 300 RTK + H20T',
 flightDuration: '6 jam 15 menit', photosCaptured: 1240, gpsPoints: 12,
 criticalFindings: 4, moderateFindings: 6, safePoints: 18,
 overallRiskScore: 78, assetHealthIndex: 'B', riskLevel: 'High',
 coveragePercentage: 97.3, pilotSignature: 'Andi Pratama, SIAGA Verified Pilot',
 mainCoordinates: [
 { lat: -6.94, lng: 107.59, label: 'Tower T-01 Cimahi' },
 { lat: -6.95, lng: 107.61, label: 'Tower T-06 Bandung Selatan' },
 { lat: -6.96, lng: 107.63, label: 'Crossing Point A' },
 ],
 recommendations: [
 'Penggantian insulator retak pada Tower T-03',
 'Perbaikan grounding system Tower T-06',
 'Pemangkasan vegetasi di koridor 20m',
 'Inspeksi ulang hot spot thermal Tower T-01',
 ],
 findings: [
 { id: 'FDG-SUTET-001', location: 'Tower T-03 - Insulator', type: 'Retak insulator keramik', severity: 'High', condition: 'Perlu penggantian segera', priority: 'P1', recommendation: 'Ganti insulator sebelum musim hujan', image: '/images/projects/sutet_bandung-gallery_1-compressed.jpg' },
 { id: 'FDG-SUTET-002', location: 'Tower T-06 - Grounding', type: 'Korosi grounding rod', severity: 'High', condition: 'Resistansi di atas batas', priority: 'P1', recommendation: 'Perbaikan grounding system', image: '/images/projects/sutet_bandung-gallery_2-compressed.jpg' },
 { id: 'FDG-SUTET-003', location: 'Span T-01 to T-02', type: 'Vegetasi terlalu dekat', severity: 'Medium', condition: 'Risiko flashover', priority: 'P2', recommendation: 'Pemangkasan segera', image: '/images/projects/sutet_bandung-gallery_3-compressed.jpg' },
 { id: 'FDG-SUTET-004', location: 'Tower T-01 - Body', type: 'Hot spot thermal', severity: 'Medium', condition: 'Monitoring', priority: 'P2', recommendation: 'Inspeksi ulang dalam 30 hari', image: '/images/projects/sutet_bandung-gallery_1-compressed.jpg' },
 { id: 'FDG-SUTET-005', location: 'Tower T-05 - Foundation', type: 'Kondisi baik', severity: 'Safe', condition: 'Aman', priority: 'P4', recommendation: 'Tidak ada tindakan', image: '/images/projects/sutet_bandung-gallery_2-compressed.jpg' },
 ],
 },
 'rpt-bendungan': {
 assetOwner: 'BBWS Bengawan Solo', assetType: 'Bendungan Tipe Urugan', assetCode: 'BBWS-DAM-GM-01',
 inspectionDate: '2025-09-15', inspectionArea: '22.0 Ha', droneModel: 'DJI Matrice 350 RTK + L2 LiDAR',
 flightDuration: '8 jam 45 menit', photosCaptured: 2100, gpsPoints: 10,
 criticalFindings: 2, moderateFindings: 4, safePoints: 20,
 overallRiskScore: 65, assetHealthIndex: 'B+', riskLevel: 'Medium',
 coveragePercentage: 98.1, pilotSignature: 'Fajar Geospatial, SIAGA Verified Pilot',
 mainCoordinates: [
 { lat: -7.72, lng: 110.91, label: 'Dam Body - Crest' },
 { lat: -7.73, lng: 110.92, label: 'Spillway SP-01' },
 { lat: -7.74, lng: 110.93, label: 'Intake Tower' },
 ],
 recommendations: [
 'Perbaikan rembesan pada downstream slope',
 'Monitoring piezometer mingguan',
 'Pembersihan sedimen di intake tower',
 'Inspeksi ulang spillway sebelum musim hujan',
 ],
 findings: [
 { id: 'FDG-DAM-001', location: 'Downstream Slope - Section 3', type: 'Rembesan air', severity: 'High', condition: 'Perlu penanganan', priority: 'P1', recommendation: 'Grouting dan perbaikan drainase', image: '/images/projects/bendungan_gajahmungkur-gallery_1-compressed.jpg' },
 { id: 'FDG-DAM-002', location: 'Spillway Gate - Left', type: 'Korosi engsel gate', severity: 'High', condition: 'Perlu perbaikan', priority: 'P1', recommendation: 'Penggantian engsel dan pelumasan', image: '/images/projects/bendungan_gajahmungkur-gallery_2-compressed.jpg' },
 { id: 'FDG-DAM-003', location: 'Crest Road', type: 'Retak aspal permukaan', severity: 'Medium', condition: 'Monitoring', priority: 'P2', recommendation: 'Patching aspal', image: '/images/projects/bendungan_gajahmungkur-gallery_1-compressed.jpg' },
 { id: 'FDG-DAM-004', location: 'Intake Tower', type: 'Sedimentasi ringan', severity: 'Low', condition: 'Aman', priority: 'P3', recommendation: 'Pembersihan rutin', image: '/images/projects/bendungan_gajahmungkur-gallery_2-compressed.jpg' },
 ],
 },
 'rpt-tol': {
 assetOwner: 'PT Jasa Marga', assetType: 'Jalan Tol', assetCode: 'JM-TOL-SMGSLO-02',
 inspectionDate: '2025-11-10', inspectionArea: '35.0 Ha', droneModel: 'DJI Matrice 350 RTK',
 flightDuration: '5 jam 20 menit', photosCaptured: 1560, gpsPoints: 8,
 criticalFindings: 1, moderateFindings: 3, safePoints: 22,
 overallRiskScore: 55, assetHealthIndex: 'A-', riskLevel: 'Low-Medium',
 coveragePercentage: 96.5, pilotSignature: 'Budi Setiawan, SIAGA Verified Pilot',
 mainCoordinates: [
 { lat: -7.25, lng: 110.45, label: 'KM 12 - Flyover Ungaran' },
 { lat: -7.35, lng: 110.55, label: 'KM 28 - Jembatan Kali Garang' },
 { lat: -7.45, lng: 110.70, label: 'KM 45 - Rest Area Salatiga' },
 ],
 recommendations: [
 'Perbaikan deformasi aspal di KM 15',
 'Monitoring retakan guardrail KM 28',
 'Pengecatan ulang marka jalan KM 30-35',
 ],
 findings: [
 { id: 'FDG-TOL-001', location: 'KM 15 - Lajur Kiri', type: 'Deformasi aspal (rutting)', severity: 'High', condition: 'Perlu overlay', priority: 'P1', recommendation: 'Overlay aspal segera', image: '/images/projects/tol_semarangsolo-gallery_1-compressed.jpg' },
 { id: 'FDG-TOL-002', location: 'KM 28 - Guardrail', type: 'Guardrail bengkok', severity: 'Medium', condition: 'Perlu perbaikan', priority: 'P2', recommendation: 'Penggantian section guardrail', image: '/images/projects/tol_semarangsolo-gallery_1-compressed.jpg' },
 { id: 'FDG-TOL-003', location: 'KM 30-35 - Marka', type: 'Marka pudar', severity: 'Low', condition: 'Aman', priority: 'P3', recommendation: 'Pengecatan ulang marka', image: '/images/projects/tol_semarangsolo-cover-compressed.jpg' },
 { id: 'FDG-TOL-004', location: 'KM 45 - Rest Area', type: 'Kondisi baik', severity: 'Safe', condition: 'Aman', priority: 'P4', recommendation: 'Tidak ada tindakan', image: '/images/projects/tol_semarangsolo-cover-compressed.jpg' },
 ],
 },
 'rpt-tower': {
 assetOwner: 'Telkom Indonesia', assetType: 'Menara Telekomunikasi', assetCode: 'TLKM-TWR-SKA-15',
 inspectionDate: '2025-11-20', inspectionArea: '2.5 Ha', droneModel: 'DJI Mavic 3T Enterprise',
 flightDuration: '2 jam 10 menit', photosCaptured: 420, gpsPoints: 6,
 criticalFindings: 2, moderateFindings: 3, safePoints: 12,
 overallRiskScore: 68, assetHealthIndex: 'B', riskLevel: 'Medium',
 coveragePercentage: 99.2, pilotSignature: 'Cahya Drone ID, SIAGA Verified Pilot',
 mainCoordinates: [
 { lat: -7.57, lng: 110.82, label: 'Tower Base' },
 { lat: -7.57, lng: 110.82, label: 'Antenna Level 1 (30m)' },
 { lat: -7.57, lng: 110.82, label: 'Antenna Level 2 (60m)' },
 ],
 recommendations: [
 'Penggantian konektor antenna yang korosi',
 'Perbaikan anti-climbing device',
 'Pengecatan ulang struktur tower',
 'Inspeksi ulang foundation setelah musim hujan',
 ],
 findings: [
 { id: 'FDG-TWR-001', location: 'Level 2 - Antenna Connector', type: 'Korosi konektor RF', severity: 'High', condition: 'Signal loss risk', priority: 'P1', recommendation: 'Penggantian konektor', image: '/images/projects/tower_surakarta-cover-compressed.jpg' },
 { id: 'FDG-TWR-002', location: 'Level 1 - Anti-climbing', type: 'Anti-climbing device rusak', severity: 'High', condition: 'Safety hazard', priority: 'P1', recommendation: 'Perbaikan segera', image: '/images/projects/sutet_bandung-gallery_1-compressed.jpg' },
 { id: 'FDG-TWR-003', location: 'Body - Section 3', type: 'Cat mengelupas', severity: 'Medium', condition: 'Korosi awal', priority: 'P2', recommendation: 'Pengecatan ulang', image: '/images/projects/sutet_bandung-gallery_2-compressed.jpg' },
 { id: 'FDG-TWR-004', location: 'Foundation', type: 'Kondisi baik', severity: 'Safe', condition: 'Aman', priority: 'P4', recommendation: 'Monitoring rutin', image: '/images/projects/tower_surakarta-cover-compressed.jpg' },
 ],
 },
};

// ─── EXPORTED FUNCTIONS ──────────────────────────────────────────────────────

/**
 * Get images for a project by ID. Falls back to default.
 */
export function getProjectImages(project) {
 if (!project) return DEFAULT_IMAGES;
 return PROJECT_IMAGES[project.id] || DEFAULT_IMAGES;
}

/**
 * Get enriched inspection data for a project.
 */
export function getInspectionData(project) {
 if (!project) return null;
 if (INSPECTION_DATA[project.id]) return INSPECTION_DATA[project.id];

 // Fallback for projects without specific data
 const pilotName = project.bids?.[0]?.pilot_nama || 'SIAGA Pilot';
 return {
 assetOwner: project.client_info?.nama || project.client_nama || 'N/A',
 assetType: project.jenis_infrastruktur || 'Infrastruktur',
 assetCode: `AST-${project.id.replace('proj-', '').padStart(3, '0')}`,
 inspectionDate: project.milestones?.find(m => m.label === 'Report Ready')?.date || '2025-12-01',
 inspectionArea: `${project.luas_area || 5} Ha`,
 droneModel: project.bids?.[0]?.drone_type || 'DJI Matrice 300 RTK',
 flightDuration: '3 jam 15 menit',
 photosCaptured: Math.max(200, (project.jumlah_titik_inspeksi || 5) * 50),
 gpsPoints: project.jumlah_titik_inspeksi || 6,
 criticalFindings: 2, moderateFindings: 4, safePoints: 10,
 overallRiskScore: 68, assetHealthIndex: 'B', riskLevel: 'Medium',
 coveragePercentage: 91.2, pilotSignature: `${pilotName}, SIAGA Verified Pilot`,
 mainCoordinates: (project.titik_inspeksi || []).slice(0, 3),
 recommendations: ['Inspeksi lanjutan area kritis', 'Maintenance preventif 30 hari', 'Monitoring berkala 3 bulan'],
 findings: [
 { id: 'FDG-001', location: 'Area Utama', type: 'Kerusakan ringan', severity: 'Medium', condition: 'Monitoring', priority: 'P2', recommendation: 'Inspeksi visual berkala', image: getProjectImages(project).galleryImages?.[0] || '' },
 { id: 'FDG-002', location: 'Area Sekunder', type: 'Korosi permukaan', severity: 'Low', condition: 'Aman', priority: 'P3', recommendation: 'Maintenance rutin', image: getProjectImages(project).galleryImages?.[1] || '' },
 ],
 };
}

/**
 * Determine if a project is "completed".
 */
function isProjectCompleted(project) {
 if (project.milestones && project.milestones.length > 0) {
 return project.milestones.every((m) => m.status === 'completed');
 }
 return project.status === 'completed' || project.status === 'inspection_complete';
}

/**
 * Get all completed projects — merges global data + local demo projects.
 */
export function getReportProjects() {
 const globalCompleted = projectDetailData.filter(isProjectCompleted);
 // Merge: global first, then local (avoid duplicates by id)
 const ids = new Set(globalCompleted.map(p => p.id));
 const localNew = LOCAL_COMPLETED_PROJECTS.filter(p => !ids.has(p.id));
 return [...globalCompleted, ...localNew];
}

/**
 * Get a single project by ID from completed projects.
 */
export function getReportProjectById(projectId) {
 return getReportProjects().find((p) => p.id === projectId) || null;
}

export default { getReportProjects, getReportProjectById, getProjectImages, getInspectionData };
