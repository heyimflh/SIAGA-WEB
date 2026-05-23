import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
 getCompletedProjects,
 getProjectById,
 getPreviewPages,
 getProgressStage,
 generateReportId,
 canProceedFromStep,
 resetWizardState,
 getInitialWizardState,
 getTotalPages,
 isValidProjectId,
 formatFileSize,
 REPORT_BLOCKS,
} from '../report-logic.js';
import { getProjectImages, getInspectionData, getReportProjects } from '../report-data.js';

describe('report-logic property tests', () => {

 describe('getCompletedProjects', () => {
 it('returns only projects where all milestones are completed', () => {
 fc.assert(
 fc.property(
 fc.array(
 fc.record({
 id: fc.string({ minLength: 1 }),
 status: fc.constantFrom('open', 'completed', 'inspection_complete', 'urgent'),
 milestones: fc.array(
 fc.record({
 label: fc.string(),
 status: fc.constantFrom('completed', 'in_progress', 'upcoming'),
 }),
 { minLength: 1, maxLength: 5 }
 ),
 }),
 { minLength: 0, maxLength: 10 }
 ),
 (projects) => {
 const result = getCompletedProjects(projects);
 result.forEach((p) => {
 if (p.milestones && p.milestones.length > 0) {
 expect(p.milestones.every((m) => m.status === 'completed')).toBe(true);
 } else {
 expect(['completed', 'inspection_complete']).toContain(p.status);
 }
 });
 }
 )
 );
 });
 });

 describe('getProgressStage', () => {
 it('returns a non-empty string for any progress 0-100', () => {
 fc.assert(
 fc.property(fc.integer({ min: 0, max: 100 }), (progress) => {
 const stage = getProgressStage(progress);
 expect(typeof stage).toBe('string');
 expect(stage.length).toBeGreaterThan(0);
 })
 );
 });
 });

 describe('generateReportId', () => {
 it('always matches RPT-YYYY-NNNN format', () => {
 fc.assert(
 fc.property(fc.constant(null), () => {
 const id = generateReportId();
 expect(id).toMatch(/^RPT-\d{4}-\d{4}$/);
 }),
 { numRuns: 50 }
 );
 });

 it('generates different IDs on repeated calls (probabilistic)', () => {
 const ids = new Set();
 for (let i = 0; i < 20; i++) {
 ids.add(generateReportId());
 }

 expect(ids.size).toBeGreaterThan(1);
 });
 });

 describe('canProceedFromStep', () => {
 it('step 0 requires selectedProject !== null', () => {
 fc.assert(
 fc.property(
 fc.oneof(fc.constant(null), fc.record({ id: fc.string() })),
 (project) => {
 const state = { ...getInitialWizardState(), selectedProject: project };
 const result = canProceedFromStep(0, state);
 expect(result).toBe(project !== null);
 }
 )
 );
 });

 it('step 1 requires at least one checkbox true', () => {
 fc.assert(
 fc.property(
 fc.record({
 cover: fc.boolean(),
 map: fc.boolean(),
 gallery: fc.boolean(),
 table: fc.boolean(),
 signature: fc.boolean(),
 }),
 (checkboxState) => {
 const state = { ...getInitialWizardState(), checkboxState };
 const result = canProceedFromStep(1, state);
 const hasAny = Object.values(checkboxState).some((v) => v);
 expect(result).toBe(hasAny);
 }
 )
 );
 });
 });

 describe('getPreviewPages', () => {
 it('returns pages matching exactly the checked checkboxes', () => {
 fc.assert(
 fc.property(
 fc.record({
 cover: fc.boolean(),
 map: fc.boolean(),
 gallery: fc.boolean(),
 table: fc.boolean(),
 signature: fc.boolean(),
 }),
 (checkboxState) => {
 const pages = getPreviewPages(checkboxState);
 const checkedIds = Object.entries(checkboxState)
 .filter(([, v]) => v)
 .map(([k]) => k);
 const pageIds = pages.map((p) => p.id);
 expect(pageIds).toEqual(checkedIds);
 }
 )
 );
 });
 });

 describe('resetWizardState', () => {
 it('returns the same structure as getInitialWizardState', () => {
 const reset = resetWizardState();
 const initial = getInitialWizardState();
 expect(reset).toEqual(initial);
 });

 it('has all checkboxes true', () => {
 const state = resetWizardState();
 Object.values(state.checkboxState).forEach((v) => {
 expect(v).toBe(true);
 });
 });

 it('has step 0 and no selected project', () => {
 const state = resetWizardState();
 expect(state.currentStep).toBe(0);
 expect(state.selectedProject).toBeNull();
 expect(state.progress).toBe(0);
 expect(state.reportId).toBeNull();
 expect(state.isGeneratingPdf).toBe(false);
 });
 });

 describe('getTotalPages', () => {
 it('equals sum of estimatedPages for checked blocks', () => {
 fc.assert(
 fc.property(
 fc.record({
 cover: fc.boolean(),
 map: fc.boolean(),
 gallery: fc.boolean(),
 table: fc.boolean(),
 signature: fc.boolean(),
 }),
 (checkboxState) => {
 const total = getTotalPages(checkboxState);
 const expected = REPORT_BLOCKS
 .filter((b) => checkboxState[b.id])
 .reduce((sum, b) => sum + b.estimatedPages, 0);
 expect(total).toBe(expected);
 }
 )
 );
 });
 });

 describe('formatFileSize', () => {
 it('returns a string ending with B, KB, or MB', () => {
 fc.assert(
 fc.property(fc.integer({ min: 0, max: 100000000 }), (bytes) => {
 const result = formatFileSize(bytes);
 expect(result).toMatch(/(B|KB|MB)$/);
 })
 );
 });
 });

 describe('isValidProjectId', () => {
 it('returns false for null/undefined/empty projectId', () => {
 fc.assert(
 fc.property(
 fc.oneof(fc.constant(null), fc.constant(undefined), fc.constant('')),
 (id) => {
 expect(isValidProjectId(id, [{ id: 'proj-001' }])).toBe(false);
 }
 )
 );
 });

 it('returns true only if projectId exists in the list', () => {
 const projects = [{ id: 'proj-001' }, { id: 'proj-014' }];
 expect(isValidProjectId('proj-001', projects)).toBe(true);
 expect(isValidProjectId('proj-999', projects)).toBe(false);
 });
 });
});

describe('report-data image and inspection functions', () => {
 describe('getReportProjects', () => {
 it('returns at least 5 completed projects', () => {
 const projects = getReportProjects();
 expect(projects.length).toBeGreaterThanOrEqual(5);
 });

 it('every project has coverImage via getProjectImages', () => {
 const projects = getReportProjects();
 projects.forEach((p) => {
 const images = getProjectImages(p);
 expect(images.coverImage).toBeTruthy();
 expect(typeof images.coverImage).toBe('string');
 });
 });
 });

 describe('getProjectImages', () => {
 it('returns an object with coverImage for any project', () => {
 const project = { id: 'proj-014', jenis_infrastruktur: 'Jembatan' };
 const images = getProjectImages(project);
 expect(images).toHaveProperty('coverImage');
 expect(typeof images.coverImage).toBe('string');
 expect(images.coverImage.length).toBeGreaterThan(0);
 });

 it('returns fallback images for unknown project', () => {
 const project = { id: 'proj-999', jenis_infrastruktur: 'Unknown' };
 const images = getProjectImages(project);
 expect(images).toHaveProperty('coverImage');
 expect(images.coverImage).toBeTruthy();
 });

 it('returns default fallback for null project', () => {
 const images = getProjectImages(null);
 expect(images).toHaveProperty('coverImage');
 });
 });

 describe('getInspectionData', () => {
 it('returns enriched data for proj-014', () => {
 const project = { id: 'proj-014', jenis_infrastruktur: 'Jembatan', lokasi: { kota: 'Batam' } };
 const data = getInspectionData(project);
 expect(data).toHaveProperty('assetOwner');
 expect(data).toHaveProperty('findings');
 expect(data).toHaveProperty('recommendations');
 expect(data.findings.length).toBeGreaterThan(0);
 });

 it('returns fallback data for unknown project', () => {
 const project = {
 id: 'proj-999',
 jenis_infrastruktur: 'Tower',
 client_info: { nama: 'Test Corp' },
 bids: [{ pilot_nama: 'Test Pilot', drone_type: 'DJI' }],
 milestones: [{ label: 'Report Ready', date: '2025-12-01' }],
 jumlah_titik_inspeksi: 5,
 luas_area: 10,
 };
 const data = getInspectionData(project);
 expect(data).toHaveProperty('assetOwner', 'Test Corp');
 expect(data).toHaveProperty('findings');
 expect(data.findings.length).toBeGreaterThan(0);
 });

 it('returns null for null project', () => {
 expect(getInspectionData(null)).toBeNull();
 });
 });
});
