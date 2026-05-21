/**
 * Property tests for project-logic.js pure functions.
 * Feature: project-detail-page
 * Task 4: Tests for pure logic layer
 */
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
 getProjectById,
 getProjectStatus,
 isDeadlinePassed,
 getStatusBadgeVisual,
 getRoleVisibility,
 getHeroCTA,
 getDashboardPath,
 validateBidForm,
 getRelatedProjects,
 formatTanggalIndonesia,
 formatRupiah,
 formatCompactRupiah,
 getBriefingSummary,
 getBidIntelligenceMetrics,
 isMilestoneConsistent,
} from '../project-logic.js';
import projectDetailData from '../project-detail-data.js';

// --- Task 4.1: Project lookup is total and correct ---
describe('getProjectById — Property: lookup is total and correct', () => {
 test('valid id returns the correct project', () => {
 projectDetailData.forEach((p) => {
 const result = getProjectById(projectDetailData, p.id);
 expect(result).not.toBeNull();
 expect(result.id).toBe(p.id);
 expect(result.nama).toBe(p.nama);
 });
 });

 test('invalid id returns null', () => {
 fc.assert(
 fc.property(fc.string(), (randomId) => {
 const exists = projectDetailData.some((p) => p.id === randomId);
 const result = getProjectById(projectDetailData, randomId);
 if (exists) {
 expect(result).not.toBeNull();
 } else {
 expect(result).toBeNull();
 }
 }),
 { numRuns: 100 },
 );
 });

 test('null/undefined inputs return null', () => {
 expect(getProjectById(null, 'proj-001')).toBeNull();
 expect(getProjectById(projectDetailData, null)).toBeNull();
 expect(getProjectById(projectDetailData, undefined)).toBeNull();
 });
});

// --- Task 4.2: Status badge visual mapping ---
describe('getStatusBadgeVisual — Property: deterministic and complete', () => {
 const allStatuses = ['open', 'urgent', 'deadline_dekat', 'in_progress', 'completed', 'closed', 'expired'];

 test('all known statuses return valid badge config', () => {
 allStatuses.forEach((status) => {
 const badge = getStatusBadgeVisual(status);
 expect(badge).toBeDefined();
 expect(badge.label).toBeTruthy();
 expect(badge.color).toBeTruthy();
 expect(badge.cssClass).toBeTruthy();
 });
 });

 test('same status always returns same result (deterministic)', () => {
 allStatuses.forEach((status) => {
 const a = getStatusBadgeVisual(status);
 const b = getStatusBadgeVisual(status);
 expect(a).toEqual(b);
 });
 });

 test('unknown status returns fallback badge', () => {
 fc.assert(
 fc.property(fc.string(), (randomStatus) => {
 const badge = getStatusBadgeVisual(randomStatus);
 expect(badge).toBeDefined();
 expect(badge.label).toBeTruthy();
 expect(badge.color).toBeTruthy();
 expect(badge.cssClass).toBeTruthy();
 }),
 { numRuns: 50 },
 );
 });
});

// --- Task 4.3: Role-aware data isolation ---
describe('getRoleVisibility — Property: pilot never sees bid table', () => {
 const statuses = ['open', 'urgent', 'deadline_dekat', 'in_progress', 'completed', 'closed', 'expired'];

 test('pilot showBidTable is always false', () => {
 statuses.forEach((status) => {
 [true, false].forEach((hasBid) => {
 const vis = getRoleVisibility('pilot', status, hasBid);
 expect(vis.showBidTable).toBe(false);
 });
 });
 });

 test('pilot showBidIntelligencePanel is always false', () => {
 statuses.forEach((status) => {
 [true, false].forEach((hasBid) => {
 const vis = getRoleVisibility('pilot', status, hasBid);
 expect(vis.showBidIntelligencePanel).toBe(false);
 });
 });
 });

 test('pilot showContractValue is always false', () => {
 statuses.forEach((status) => {
 [true, false].forEach((hasBid) => {
 const vis = getRoleVisibility('pilot', status, hasBid);
 expect(vis.showContractValue).toBe(false);
 });
 });
 });
});

// --- Task 4.4: Role visibility exhaustive ---
describe('getRoleVisibility — Property: exhaustive combinations return complete object', () => {
 const roles = ['client', 'pilot'];
 const statuses = ['open', 'urgent', 'deadline_dekat', 'in_progress', 'completed', 'closed', 'expired'];
 const hasBidValues = [true, false];

 test('all role × status × hasBid combinations return complete visibility object', () => {
 roles.forEach((role) => {
 statuses.forEach((status) => {
 hasBidValues.forEach((hasBid) => {
 const vis = getRoleVisibility(role, status, hasBid);
 expect(vis).toBeDefined();
 expect(typeof vis.showContractValue).toBe('boolean');
 expect(typeof vis.showBidTable).toBe('boolean');
 expect(typeof vis.showBidForm).toBe('boolean');
 expect(typeof vis.showClientInfo).toBe('boolean');
 expect(typeof vis.showRelatedProjects).toBe('boolean');
 expect(typeof vis.showBidCommandPanel).toBe('boolean');
 expect(typeof vis.showBidIntelligencePanel).toBe('boolean');
 expect(typeof vis.biddingClosed).toBe('boolean');
 });
 });
 });
 });
});

// --- Task 4.5: Expired status handling ---
describe('getProjectStatus — Property: expired when deadline passed and status open', () => {
 test('open project with past deadline becomes expired', () => {
 fc.assert(
 fc.property(
 fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }).filter((d) => !isNaN(d.getTime())),
 (pastDate) => {
 const project = { status: 'open', deadline: pastDate.toISOString().split('T')[0] };
 const today = new Date('2026-06-01');
 const result = getProjectStatus(project, today);
 expect(result).toBe('expired');
 },
 ),
 { numRuns: 50 },
 );
 });

 test('open project with future deadline stays open', () => {
 const project = { status: 'open', deadline: '2027-12-31' };
 const today = new Date('2026-06-01');
 expect(getProjectStatus(project, today)).toBe('open');
 });

 test('non-open statuses are not affected by deadline', () => {
 const statuses = ['urgent', 'deadline_dekat', 'in_progress', 'completed', 'closed'];
 statuses.forEach((status) => {
 const project = { status, deadline: '2020-01-01' };
 const today = new Date('2026-06-01');
 expect(getProjectStatus(project, today)).toBe(status);
 });
 });
});

// --- Task 4.6: Bid form validation ---
describe('validateBidForm — Property: valid iff harga > 0 and estimasiHari > 0', () => {
 test('valid form returns valid:true with no errors', () => {
 fc.assert(
 fc.property(
 fc.integer({ min: 1, max: 999999999 }),
 fc.integer({ min: 1, max: 365 }),
 (harga, estimasiHari) => {
 const result = validateBidForm({ harga: String(harga), estimasiHari: String(estimasiHari) });
 expect(result.valid).toBe(true);
 expect(result.errors).toEqual({});
 },
 ),
 { numRuns: 50 },
 );
 });

 test('zero or empty harga returns correct error', () => {
 const cases = ['', '0', null, undefined];
 cases.forEach((harga) => {
 const result = validateBidForm({ harga, estimasiHari: '5' });
 expect(result.valid).toBe(false);
 expect(result.errors.harga).toBe('Harga penawaran wajib diisi');
 });
 });

 test('zero or empty estimasiHari returns correct error', () => {
 const cases = ['', '0', null, undefined];
 cases.forEach((estimasiHari) => {
 const result = validateBidForm({ harga: '100000', estimasiHari });
 expect(result.valid).toBe(false);
 expect(result.errors.estimasiHari).toBe('Estimasi hari wajib diisi');
 });
 });

 test('both invalid returns both errors', () => {
 const result = validateBidForm({ harga: '', estimasiHari: '' });
 expect(result.valid).toBe(false);
 expect(result.errors.harga).toBeDefined();
 expect(result.errors.estimasiHari).toBeDefined();
 });
});

// --- Task 4.7: Related project filtering ---
describe('getRelatedProjects — Property: filtering rules', () => {
 test('current project is always excluded', () => {
 projectDetailData.forEach((p) => {
 const related = getRelatedProjects(p, projectDetailData);
 const ids = related.map((r) => r.id);
 expect(ids).not.toContain(p.id);
 });
 });

 test('max 3 results', () => {
 projectDetailData.forEach((p) => {
 const related = getRelatedProjects(p, projectDetailData);
 expect(related.length).toBeLessThanOrEqual(3);
 });
 });

 test('same infrastructure is prioritized', () => {
 const proj = projectDetailData.find((p) => p.id === 'proj-001'); // SUTET
 const related = getRelatedProjects(proj, projectDetailData);
 if (related.length > 0) {
 // At least the first result should be same infra if available
 const sameInfraCount = related.filter(
 (r) => r.jenis_infrastruktur === proj.jenis_infrastruktur
 ).length;
 const totalSameInfra = projectDetailData.filter(
 (p) => p.id !== proj.id && p.jenis_infrastruktur === proj.jenis_infrastruktur
 ).length;
 if (totalSameInfra > 0) {
 expect(sameInfraCount).toBeGreaterThan(0);
 }
 }
 });

 test('null inputs return empty array', () => {
 expect(getRelatedProjects(null, projectDetailData)).toEqual([]);
 expect(getRelatedProjects(projectDetailData[0], null)).toEqual([]);
 });
});

// --- Task 4.8: Hero CTA deterministic ---
describe('getHeroCTA — Property: deterministic for same inputs', () => {
 const roles = ['client', 'pilot'];
 const statuses = ['open', 'urgent', 'deadline_dekat', 'in_progress', 'completed', 'closed', 'expired'];

 test('same role/status/hasBid always returns same CTA', () => {
 roles.forEach((role) => {
 statuses.forEach((status) => {
 [true, false].forEach((hasBid) => {
 const a = getHeroCTA(role, status, hasBid);
 const b = getHeroCTA(role, status, hasBid);
 expect(a).toEqual(b);
 expect(a.label).toBeTruthy();
 expect(typeof a.disabled).toBe('boolean');
 expect(a.action).toBeTruthy();
 });
 });
 });
 });

 test('pilot with hasBid=true always gets disabled CTA', () => {
 statuses.forEach((status) => {
 const cta = getHeroCTA('pilot', status, true);
 expect(cta.disabled).toBe(true);
 expect(cta.label).toContain('Terkirim');
 });
 });
});

// --- Task 4.9: Milestone consistency ---
describe('isMilestoneConsistent — Property: in_progress status needs in_progress milestone', () => {
 test('in_progress status with in_progress milestone is consistent', () => {
 const milestones = [
 { label: 'Posted', status: 'completed' },
 { label: 'Bidding Open', status: 'in_progress' },
 { label: 'Pilot Selected', status: 'upcoming' },
 ];
 expect(isMilestoneConsistent('in_progress', milestones)).toBe(true);
 });

 test('in_progress status without in_progress milestone is inconsistent', () => {
 const milestones = [
 { label: 'Posted', status: 'completed' },
 { label: 'Bidding Open', status: 'upcoming' },
 ];
 expect(isMilestoneConsistent('in_progress', milestones)).toBe(false);
 });

 test('completed status with all completed milestones is consistent', () => {
 const milestones = [
 { label: 'Posted', status: 'completed' },
 { label: 'Done', status: 'completed' },
 ];
 expect(isMilestoneConsistent('completed', milestones)).toBe(true);
 });

 test('empty milestones returns true (graceful)', () => {
 expect(isMilestoneConsistent('open', [])).toBe(true);
 expect(isMilestoneConsistent('open', null)).toBe(true);
 });
});

// --- Task 4.10: Mock data schema validation ---
describe('projectDetailData — Property: schema validation', () => {
 const detailedIds = ['proj-001', 'proj-002', 'proj-003', 'proj-004', 'proj-005', 'proj-014'];

 test('all projects have required base fields', () => {
 projectDetailData.forEach((p) => {
 expect(p.id).toBeTruthy();
 expect(p.nama).toBeTruthy();
 expect(p.jenis_infrastruktur).toBeTruthy();
 expect(typeof p.nilai_kontrak).toBe('number');
 expect(p.lokasi).toBeDefined();
 expect(p.lokasi.lat).toBeDefined();
 expect(p.lokasi.lng).toBeDefined();
 expect(p.lokasi.kota).toBeTruthy();
 expect(p.lokasi.provinsi).toBeTruthy();
 expect(p.deadline).toBeTruthy();
 expect(p.status).toBeTruthy();
 expect(typeof p.jumlah_bidder).toBe('number');
 });
 });

 test('detailed projects have valid polygon_area (>= 3 coords)', () => {
 detailedIds.forEach((id) => {
 const p = getProjectById(projectDetailData, id);
 expect(p.polygon_area.length).toBeGreaterThanOrEqual(3);
 p.polygon_area.forEach(([lng, lat]) => {
 expect(lng).toBeGreaterThanOrEqual(95);
 expect(lng).toBeLessThanOrEqual(141);
 expect(lat).toBeGreaterThanOrEqual(-11);
 expect(lat).toBeLessThanOrEqual(6);
 });
 });
 });

 test('detailed projects have valid titik_inspeksi', () => {
 detailedIds.forEach((id) => {
 const p = getProjectById(projectDetailData, id);
 expect(p.titik_inspeksi.length).toBeGreaterThan(0);
 p.titik_inspeksi.forEach((pt) => {
 expect(typeof pt.lat).toBe('number');
 expect(typeof pt.lng).toBe('number');
 expect(pt.label).toBeTruthy();
 expect(pt.lat).toBeGreaterThanOrEqual(-11);
 expect(pt.lat).toBeLessThanOrEqual(6);
 expect(pt.lng).toBeGreaterThanOrEqual(95);
 expect(pt.lng).toBeLessThanOrEqual(141);
 });
 });
 });

 test('detailed projects have valid milestones', () => {
 detailedIds.forEach((id) => {
 const p = getProjectById(projectDetailData, id);
 expect(p.milestones.length).toBe(5);
 p.milestones.forEach((m) => {
 expect(m.label).toBeTruthy();
 expect(['completed', 'in_progress', 'upcoming']).toContain(m.status);
 });
 });
 });

 test('detailed projects have valid client_info', () => {
 detailedIds.forEach((id) => {
 const p = getProjectById(projectDetailData, id);
 expect(p.client_info.nama).toBeTruthy();
 expect(typeof p.client_info.rating).toBe('number');
 expect(typeof p.client_info.proyek_selesai).toBe('number');
 expect(p.client_info.member_since).toBeTruthy();
 expect(typeof p.client_info.verified).toBe('boolean');
 });
 });

 test('detailed projects have valid bids', () => {
 detailedIds.forEach((id) => {
 const p = getProjectById(projectDetailData, id);
 expect(p.bids.length).toBeGreaterThan(0);
 p.bids.forEach((b) => {
 expect(b.id).toBeTruthy();
 expect(b.pilot_id).toBeTruthy();
 expect(b.pilot_nama).toBeTruthy();
 expect(typeof b.pilot_rating).toBe('number');
 expect(typeof b.harga_bid).toBe('number');
 expect(typeof b.estimasi_hari).toBe('number');
 expect(b.drone_type).toBeTruthy();
 });
 });
 });
});

// --- Formatting helpers ---
describe('formatTanggalIndonesia', () => {
 test('formats valid date correctly', () => {
 expect(formatTanggalIndonesia('2026-03-15')).toBe('15 Maret 2026');
 expect(formatTanggalIndonesia('2026-01-01')).toBe('1 Januari 2026');
 });

 test('returns dash for invalid input', () => {
 expect(formatTanggalIndonesia(null)).toBe('-');
 expect(formatTanggalIndonesia('')).toBe('-');
 expect(formatTanggalIndonesia('invalid')).toBe('-');
 });
});

describe('formatRupiah', () => {
 test('formats number to Rupiah', () => {
 const result = formatRupiah(350000000);
 expect(result).toContain('Rp');
 expect(result).toContain('350');
 });

 test('returns dash for invalid input', () => {
 expect(formatRupiah(null)).toBe('-');
 expect(formatRupiah(undefined)).toBe('-');
 });
});

describe('formatCompactRupiah', () => {
 test('formats billions with M suffix', () => {
 expect(formatCompactRupiah(1200000000)).toBe('Rp1.2M');
 });

 test('formats millions with jt suffix', () => {
 expect(formatCompactRupiah(350000000)).toBe('Rp350jt');
 });
});

describe('getDashboardPath', () => {
 test('client returns client dashboard', () => {
 expect(getDashboardPath('client')).toBe('/dashboard/client');
 });

 test('pilot returns pilot dashboard', () => {
 expect(getDashboardPath('pilot')).toBe('/dashboard/pilot');
 });

 test('unknown role returns root', () => {
 expect(getDashboardPath('admin')).toBe('/');
 });
});

describe('getBidIntelligenceMetrics', () => {
 test('computes metrics from bids', () => {
 const project = getProjectById(projectDetailData, 'proj-001');
 const metrics = getBidIntelligenceMetrics(project);
 expect(metrics.total).toBe(project.bids.length);
 expect(metrics.verified).toBeGreaterThan(0);
 expect(metrics.lowestPrice).toBeGreaterThan(0);
 expect(metrics.fastestDays).toBeGreaterThan(0);
 expect(metrics.highestRating).toBeGreaterThan(0);
 });

 test('returns zeros for project without bids', () => {
 const metrics = getBidIntelligenceMetrics({ bids: [] });
 expect(metrics.total).toBe(0);
 });
});
