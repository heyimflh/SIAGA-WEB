import { describe, it, expect } from 'vitest';
import {
 applyFilters,
 sortProjects,
 matchesInfrastructure,
 matchesLocation,
 matchesStatus,
 isWithinRange,
 formatRupiah,
 getLocationSuggestions,
 computeStats,
} from '../filters.js';
import projects from '../mock-data.js';

const fixtureProjects = [
 {
 id: 'T-001',
 nama: 'Project Alpha',
 jenis_infrastruktur: 'SUTET',
 nilai_kontrak: 500_000_000,
 lokasi: { lat: -6.2, lng: 106.8, kota: 'Jakarta', provinsi: 'DKI Jakarta' },
 deadline: '2026-04-01',
 status: 'open',
 jumlah_bidder: 3,
 },
 {
 id: 'T-002',
 nama: 'Project Beta',
 jenis_infrastruktur: 'Jembatan',
 nilai_kontrak: 1_000_000_000,
 lokasi: { lat: -7.25, lng: 112.75, kota: 'Surabaya', provinsi: 'Jawa Timur' },
 deadline: '2026-04-01',
 status: 'urgent',
 jumlah_bidder: 5,
 },
 {
 id: 'T-003',
 nama: 'Project Gamma',
 jenis_infrastruktur: 'Kilang',
 nilai_kontrak: 200_000_000,
 lokasi: { lat: -1.5, lng: 116.0, kota: 'Balikpapan', provinsi: 'Kalimantan Timur' },
 deadline: '2026-03-15',
 status: 'closed',
 jumlah_bidder: 2,
 },
 {
 id: 'T-004',
 nama: 'Project Delta',
 jenis_infrastruktur: 'SUTET',
 nilai_kontrak: 500_000_000,
 lokasi: { lat: -6.9, lng: 110.4, kota: 'Semarang', provinsi: 'Jawa Tengah' },
 deadline: '2026-05-01',
 status: 'deadline_dekat',
 jumlah_bidder: 1,
 },
];

describe('applyFilters', () => {
 it('returns all projects when filters is null', () => {
 const result = applyFilters(fixtureProjects, null);
 expect(result).toHaveLength(fixtureProjects.length);
 });

 it('returns all projects when filters is empty object (defaults)', () => {
 const result = applyFilters(fixtureProjects, {});
 expect(result).toHaveLength(fixtureProjects.length);
 });

 it('returns all projects when chips array is empty', () => {
 const result = applyFilters(fixtureProjects, {
 chips: [],
 valueRange: [0, Infinity],
 location: null,
 statusFilter: 'all',
 });
 expect(result).toHaveLength(fixtureProjects.length);
 });

 it('returns correct subset with single chip filter', () => {
 const result = applyFilters(fixtureProjects, {
 chips: ['SUTET'],
 valueRange: [0, Infinity],
 location: null,
 statusFilter: 'all',
 });
 expect(result).toHaveLength(2);
 expect(result.every((p) => p.jenis_infrastruktur === 'SUTET')).toBe(true);
 });

 it('returns OR match with multiple chips', () => {
 const result = applyFilters(fixtureProjects, {
 chips: ['SUTET', 'Jembatan'],
 valueRange: [0, Infinity],
 location: null,
 statusFilter: 'all',
 });
 expect(result).toHaveLength(3);
 expect(
 result.every((p) => ['SUTET', 'Jembatan'].includes(p.jenis_infrastruktur))
 ).toBe(true);
 });

 it('applies AND logic combining all filters', () => {

 const result = applyFilters(fixtureProjects, {
 chips: ['SUTET'],
 valueRange: [400_000_000, 600_000_000],
 location: 'Jakarta',
 statusFilter: 'open',
 });
 expect(result).toHaveLength(1);
 expect(result[0].id).toBe('T-001');
 });

 it('returns empty array when projects is empty', () => {
 const result = applyFilters([], { chips: [], valueRange: [0, Infinity], location: null, statusFilter: 'all' });
 expect(result).toEqual([]);
 });

 it('returns empty array when projects is null', () => {
 const result = applyFilters(null, {});
 expect(result).toEqual([]);
 });
});

describe('isWithinRange', () => {
 it('returns true when value equals min (boundary)', () => {
 const project = { nilai_kontrak: 100 };
 expect(isWithinRange(project, [100, 500])).toBe(true);
 });

 it('returns true when value equals max (boundary)', () => {
 const project = { nilai_kontrak: 500 };
 expect(isWithinRange(project, [100, 500])).toBe(true);
 });

 it('returns true when min === max and value matches exactly', () => {
 const project = { nilai_kontrak: 500_000_000 };
 expect(isWithinRange(project, [500_000_000, 500_000_000])).toBe(true);
 });

 it('returns false when min === max and value does not match', () => {
 const project = { nilai_kontrak: 499_999_999 };
 expect(isWithinRange(project, [500_000_000, 500_000_000])).toBe(false);
 });

 it('returns false when value is below min', () => {
 const project = { nilai_kontrak: 50 };
 expect(isWithinRange(project, [100, 500])).toBe(false);
 });

 it('returns false when value is above max', () => {
 const project = { nilai_kontrak: 600 };
 expect(isWithinRange(project, [100, 500])).toBe(false);
 });
});

describe('matchesLocation', () => {
 const project = {
 lokasi: { lat: -6.2, lng: 106.8, kota: 'Jakarta', provinsi: 'DKI Jakarta' },
 };

 it('returns true when location is null (no filter)', () => {
 expect(matchesLocation(project, null)).toBe(true);
 });

 it('returns true when location is empty string (no filter)', () => {
 expect(matchesLocation(project, '')).toBe(true);
 });

 it('returns true when location matches kota (case-insensitive)', () => {
 expect(matchesLocation(project, 'jakarta')).toBe(true);
 expect(matchesLocation(project, 'JAKARTA')).toBe(true);
 });

 it('returns true when location matches provinsi', () => {
 expect(matchesLocation(project, 'DKI Jakarta')).toBe(true);
 });

 it('returns false when location does not match kota or provinsi', () => {
 expect(matchesLocation(project, 'Surabaya')).toBe(false);
 });

 it('returns false for non-existent location', () => {
 expect(matchesLocation(project, 'Atlantis')).toBe(false);
 });
});

describe('matchesInfrastructure', () => {
 const project = { jenis_infrastruktur: 'SUTET' };

 it('returns true when chips is empty (no filter)', () => {
 expect(matchesInfrastructure(project, [])).toBe(true);
 });

 it('returns true when chips is null (no filter)', () => {
 expect(matchesInfrastructure(project, null)).toBe(true);
 });

 it('returns true when project type is in chips', () => {
 expect(matchesInfrastructure(project, ['SUTET', 'Jembatan'])).toBe(true);
 });

 it('returns false when project type is not in chips', () => {
 expect(matchesInfrastructure(project, ['Jembatan', 'Kilang'])).toBe(false);
 });
});

describe('matchesStatus', () => {
 it('returns true for any status when statusFilter is "all"', () => {
 expect(matchesStatus({ status: 'open' }, 'all')).toBe(true);
 expect(matchesStatus({ status: 'closed' }, 'all')).toBe(true);
 expect(matchesStatus({ status: 'urgent' }, 'all')).toBe(true);
 expect(matchesStatus({ status: 'deadline_dekat' }, 'all')).toBe(true);
 });

 it('returns true for non-closed statuses when statusFilter is "open"', () => {
 expect(matchesStatus({ status: 'open' }, 'open')).toBe(true);
 expect(matchesStatus({ status: 'urgent' }, 'open')).toBe(true);
 expect(matchesStatus({ status: 'deadline_dekat' }, 'open')).toBe(true);
 });

 it('returns false for closed project when statusFilter is "open"', () => {
 expect(matchesStatus({ status: 'closed' }, 'open')).toBe(false);
 });
});

describe('sortProjects', () => {
 it('sorts by nilai_tertinggi descending', () => {
 const result = sortProjects(fixtureProjects, 'nilai_tertinggi');
 for (let i = 0; i < result.length - 1; i++) {
 expect(result[i].nilai_kontrak).toBeGreaterThanOrEqual(result[i + 1].nilai_kontrak);
 }
 });

 it('sorts by deadline_terdekat ascending', () => {
 const result = sortProjects(fixtureProjects, 'deadline_terdekat');
 for (let i = 0; i < result.length - 1; i++) {
 expect(new Date(result[i].deadline).getTime()).toBeLessThanOrEqual(
 new Date(result[i + 1].deadline).getTime()
 );
 }
 });

 it('sorts by terbaru descending (most recent deadline first)', () => {
 const result = sortProjects(fixtureProjects, 'terbaru');
 for (let i = 0; i < result.length - 1; i++) {
 expect(new Date(result[i].deadline).getTime()).toBeGreaterThanOrEqual(
 new Date(result[i + 1].deadline).getTime()
 );
 }
 });

 it('maintains stability when deadline values are equal', () => {

 const result = sortProjects(fixtureProjects, 'deadline_terdekat');
 const sameDeadline = result.filter((p) => p.deadline === '2026-04-01');

 expect(sameDeadline[0].id).toBe('T-001');
 expect(sameDeadline[1].id).toBe('T-002');
 });

 it('maintains stability when nilai_kontrak values are equal', () => {

 const result = sortProjects(fixtureProjects, 'nilai_tertinggi');
 const sameValue = result.filter((p) => p.nilai_kontrak === 500_000_000);

 expect(sameValue[0].id).toBe('T-001');
 expect(sameValue[1].id).toBe('T-004');
 });

 it('returns empty array for empty input', () => {
 expect(sortProjects([], 'terbaru')).toEqual([]);
 });

 it('returns empty array for null input', () => {
 expect(sortProjects(null, 'terbaru')).toEqual([]);
 });

 it('does not mutate the original array', () => {
 const original = [...fixtureProjects];
 sortProjects(fixtureProjects, 'nilai_tertinggi');
 expect(fixtureProjects).toEqual(original);
 });
});

describe('formatRupiah', () => {
 it('formats 0 correctly', () => {
 expect(formatRupiah(0)).toBe('Rp 0');
 });

 it('formats large number with dot separators', () => {
 expect(formatRupiah(1_500_000_000)).toBe('Rp 1.500.000.000');
 });

 it('formats negative number with minus sign', () => {
 expect(formatRupiah(-100_000)).toBe('Rp -100.000');
 });

 it('formats small number correctly', () => {
 expect(formatRupiah(50_000)).toBe('Rp 50.000');
 });

 it('handles null gracefully', () => {
 expect(formatRupiah(null)).toBe('Rp 0');
 });

 it('handles undefined gracefully', () => {
 expect(formatRupiah(undefined)).toBe('Rp 0');
 });

 it('handles NaN gracefully', () => {
 expect(formatRupiah(NaN)).toBe('Rp 0');
 });
});

describe('getLocationSuggestions', () => {
 it('returns sorted unique values from mock data', () => {
 const suggestions = getLocationSuggestions(projects);

 const sorted = [...suggestions].sort();
 expect(suggestions).toEqual(sorted);

 const unique = [...new Set(suggestions)];
 expect(suggestions).toEqual(unique);
 });

 it('includes both kota and provinsi values', () => {
 const suggestions = getLocationSuggestions(fixtureProjects);
 expect(suggestions).toContain('Jakarta');
 expect(suggestions).toContain('DKI Jakarta');
 expect(suggestions).toContain('Surabaya');
 expect(suggestions).toContain('Jawa Timur');
 });

 it('returns empty array for empty input', () => {
 expect(getLocationSuggestions([])).toEqual([]);
 });

 it('returns empty array for null input', () => {
 expect(getLocationSuggestions(null)).toEqual([]);
 });
});

describe('computeStats', () => {
 it('returns all zeros for empty array', () => {
 expect(computeStats([])).toEqual({ aktif: 0, open: 0, urgent: 0 });
 });

 it('returns all zeros for null input', () => {
 expect(computeStats(null)).toEqual({ aktif: 0, open: 0, urgent: 0 });
 });

 it('counts aktif as non-closed projects', () => {
 const stats = computeStats(fixtureProjects);

 expect(stats.aktif).toBe(3);
 });

 it('counts open projects correctly', () => {
 const stats = computeStats(fixtureProjects);
 expect(stats.open).toBe(1);
 });

 it('counts urgent projects correctly', () => {
 const stats = computeStats(fixtureProjects);
 expect(stats.urgent).toBe(1);
 });

 it('computes correct stats from real mock data', () => {
 const stats = computeStats(projects);
 const expectedAktif = projects.filter((p) => p.status !== 'closed').length;
 const expectedOpen = projects.filter((p) => p.status === 'open').length;
 const expectedUrgent = projects.filter((p) => p.status === 'urgent').length;
 expect(stats.aktif).toBe(expectedAktif);
 expect(stats.open).toBe(expectedOpen);
 expect(stats.urgent).toBe(expectedUrgent);
 });
});
