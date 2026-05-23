import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
 applyFilters,
 sortProjects,
 computeStats,
 getStatusVisual,
 formatRupiah,
 formatCompactRupiah,
 matchesInfrastructure,
 matchesStatus,
 isWithinRange,
 resetFilters,
 getActiveFilterCount,
} from '../filters.js';
import projects from '../mock-data.js';

const statusGen = fc.constantFrom('open', 'urgent', 'deadline_dekat', 'closed');
const infraGen = fc.constantFrom('SUTET', 'Jembatan', 'Kilang', 'Solar Panel', 'Bendungan', 'Tower');
const sortGen = fc.constantFrom('terbaru', 'nilai_tertinggi', 'deadline_terdekat');

describe('Status-to-visual mapping', () => {
 it('returns correct visual for every valid status', () => {
 fc.assert(
 fc.property(statusGen, (status) => {
 const visual = getStatusVisual(status);
 expect(visual).toBeDefined();
 expect(visual.color).toBeTruthy();
 expect(typeof visual.pulse).toBe('boolean');
 expect(typeof visual.opacity).toBe('number');
 expect(visual.opacity).toBeGreaterThan(0);
 expect(visual.opacity).toBeLessThanOrEqual(1);

 if (status === 'open') {
 expect(visual.color).toBe('#00D2FF');
 expect(visual.pulse).toBe(true);
 }
 if (status === 'urgent') {
 expect(visual.color).toBe('#FF4C4C');
 expect(visual.pulse).toBe(true);
 }
 if (status === 'deadline_dekat') {
 expect(visual.color).toBe('#F5B740');
 expect(visual.pulse).toBe(false);
 }
 if (status === 'closed') {
 expect(visual.pulse).toBe(false);
 expect(visual.opacity).toBeLessThan(1);
 }
 })
 );
 });

 it('is deterministic — same input always produces same output', () => {
 fc.assert(
 fc.property(statusGen, (status) => {
 const a = getStatusVisual(status);
 const b = getStatusVisual(status);
 expect(a).toEqual(b);
 })
 );
 });
});

describe('Filter AND/OR logic', () => {
 it('all returned projects satisfy active filters', () => {
 fc.assert(
 fc.property(
 fc.subarray(
 ['SUTET', 'Jembatan', 'Kilang', 'Solar Panel', 'Bendungan', 'Tower'],
 { minLength: 0, maxLength: 6 }
 ),
 fc.constantFrom('open', 'all'),
 (chips, statusFilter) => {
 const filters = { chips, valueRange: [0, 2500000000], location: null, statusFilter };
 const result = applyFilters(projects, filters);

 result.forEach(p => {
 if (chips.length > 0) {
 expect(chips).toContain(p.jenis_infrastruktur);
 }
 if (statusFilter === 'open') {
 expect(p.status).not.toBe('closed');
 }
 });
 }
 )
 );
 });

 it('empty chips means no infra filter applied', () => {
 const filters = { chips: [], valueRange: [0, 2500000000], location: null, statusFilter: 'all' };
 const result = applyFilters(projects, filters);
 expect(result.length).toBe(projects.length);
 });

 it('full value range does not filter any project', () => {
 const filters = { chips: [], valueRange: [0, 2500000000], location: null, statusFilter: 'all' };
 const result = applyFilters(projects, filters);
 expect(result.length).toBe(projects.length);
 });
});

describe('Sort ordering', () => {
 it('output length equals input length', () => {
 fc.assert(
 fc.property(sortGen, (sortBy) => {
 const sorted = sortProjects(projects, sortBy);
 expect(sorted.length).toBe(projects.length);
 })
 );
 });

 it('nilai_tertinggi is descending by nilai_kontrak', () => {
 const sorted = sortProjects(projects, 'nilai_tertinggi');
 for (let i = 1; i < sorted.length; i++) {
 expect(sorted[i - 1].nilai_kontrak).toBeGreaterThanOrEqual(sorted[i].nilai_kontrak);
 }
 });

 it('deadline_terdekat is ascending by deadline date', () => {
 const sorted = sortProjects(projects, 'deadline_terdekat');
 for (let i = 1; i < sorted.length; i++) {
 expect(new Date(sorted[i - 1].deadline).getTime())
 .toBeLessThanOrEqual(new Date(sorted[i].deadline).getTime());
 }
 });
});

describe('Stats consistency', () => {
 it('stats.aktif equals count of non-closed projects', () => {
 fc.assert(
 fc.property(
 fc.subarray(
 ['SUTET', 'Jembatan', 'Kilang', 'Solar Panel', 'Bendungan', 'Tower'],
 { minLength: 0, maxLength: 6 }
 ),
 (chips) => {
 const filters = { chips, valueRange: [0, 2500000000], location: null, statusFilter: 'all' };
 const filtered = applyFilters(projects, filters);
 const stats = computeStats(filtered);

 const expectedAktif = filtered.filter(p => p.status !== 'closed').length;
 const expectedOpen = filtered.filter(p => p.status === 'open').length;
 const expectedUrgent = filtered.filter(p => p.status === 'urgent').length;

 expect(stats.aktif).toBe(expectedAktif);
 expect(stats.open).toBe(expectedOpen);
 expect(stats.urgent).toBe(expectedUrgent);
 }
 )
 );
 });
});

describe('Mock data schema', () => {
 it('all projects have required fields with valid values', () => {
 const validStatuses = ['open', 'urgent', 'deadline_dekat', 'closed'];
 const validInfra = ['SUTET', 'Jembatan', 'Kilang', 'Solar Panel', 'Bendungan', 'Tower'];

 projects.forEach(p => {
 expect(p.id).toBeTruthy();
 expect(p.nama).toBeTruthy();
 expect(validInfra).toContain(p.jenis_infrastruktur);
 expect(p.nilai_kontrak).toBeGreaterThan(0);
 expect(validStatuses).toContain(p.status);
 expect(p.lokasi.lat).toBeGreaterThanOrEqual(-11);
 expect(p.lokasi.lat).toBeLessThanOrEqual(6);
 expect(p.lokasi.lng).toBeGreaterThanOrEqual(95);
 expect(p.lokasi.lng).toBeLessThanOrEqual(141);
 expect(p.lokasi.kota).toBeTruthy();
 expect(p.lokasi.provinsi).toBeTruthy();
 expect(p.deadline).toBeTruthy();
 expect(typeof p.jumlah_bidder).toBe('number');
 });
 });

 it('has minimum required variety', () => {
 const urgentCount = projects.filter(p => p.status === 'urgent').length;
 const closedCount = projects.filter(p => p.status === 'closed').length;
 const deadlineDekatCount = projects.filter(p => p.status === 'deadline_dekat').length;
 const infraTypes = new Set(projects.map(p => p.jenis_infrastruktur));

 expect(urgentCount).toBeGreaterThanOrEqual(2);
 expect(closedCount).toBeGreaterThanOrEqual(2);
 expect(deadlineDekatCount).toBeGreaterThanOrEqual(2);
 expect(infraTypes.size).toBeGreaterThanOrEqual(4);
 expect(projects.length).toBeGreaterThanOrEqual(15);
 expect(projects.length).toBeLessThanOrEqual(20);
 });
});

describe('Formatters', () => {
 it('formatRupiah handles valid numbers', () => {
 expect(formatRupiah(350000000)).toContain('350');
 expect(formatRupiah(0)).toBe('Rp 0');
 expect(formatRupiah(-1)).toBe('Rp 0');
 expect(formatRupiah(NaN)).toBe('Rp 0');
 });

 it('formatCompactRupiah produces readable output', () => {
 expect(formatCompactRupiah(350000000)).toBe('Rp 350 jt');
 expect(formatCompactRupiah(1200000000)).toBe('Rp 1,2 M');
 expect(formatCompactRupiah(2000000000)).toBe('Rp 2 M');
 expect(formatCompactRupiah(0)).toBe('Rp 0');
 });
});

describe('Utility functions', () => {
 it('resetFilters returns default state', () => {
 const defaults = resetFilters();
 expect(defaults.chips).toEqual([]);
 expect(defaults.valueRange).toEqual([0, 2500000000]);
 expect(defaults.location).toBeNull();
 expect(defaults.statusFilter).toBe('open');
 });

 it('getActiveFilterCount counts non-default filters', () => {
 expect(getActiveFilterCount(resetFilters())).toBe(0);
 expect(getActiveFilterCount({ chips: ['SUTET'], valueRange: [0, 2500000000], location: null, statusFilter: 'open' })).toBe(1);
 expect(getActiveFilterCount({ chips: ['SUTET'], valueRange: [100000000, 2500000000], location: 'Bandung', statusFilter: 'all' })).toBe(4);
 });
});
