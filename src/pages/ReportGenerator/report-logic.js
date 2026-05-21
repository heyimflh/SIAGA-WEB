/**
 * Report Logic Module — pure functions for Report Generator Page.
 * No side effects, no DOM access, fully testable.
 *
 * Feature: report-generator
 */

/**
 * Report content blocks definition.
 */
export const REPORT_BLOCKS = [
 {
 id: 'cover',
 title: 'Cover Page dengan Logo Klien',
 description: 'Identitas proyek, logo klien, dan ringkasan inspeksi.',
 estimatedPages: 1,
 icon: 'file-text',
 },
 {
 id: 'map',
 title: 'Peta Area Inspeksi + Koordinat GPS',
 description: 'Visual area inspeksi, titik koordinat, dan rute drone.',
 estimatedPages: 1,
 icon: 'map-pin',
 },
 {
 id: 'gallery',
 title: 'Galeri Foto Kerusakan',
 description: 'Dokumentasi visual temuan, anotasi, dan severity.',
 estimatedPages: 2,
 icon: 'image',
 },
 {
 id: 'table',
 title: 'Tabel Kondisi Aset',
 description: 'Status kritis/aman, kategori temuan, dan prioritas tindakan.',
 estimatedPages: 1,
 icon: 'table',
 },
 {
 id: 'signature',
 title: 'Tanda Tangan Digital Pilot',
 description: 'Validasi pilot, timestamp, dan informasi verifikasi.',
 estimatedPages: 1,
 icon: 'pen-tool',
 },
];

/**
 * Progress stages mapping.
 */
const PROGRESS_STAGES = [
 { min: 0, max: 19, label: 'Initializing geospatial engine...' },
 { min: 20, max: 39, label: 'Compiling GPS coordinates...' },
 { min: 40, max: 59, label: 'Processing orthomosaic data...' },
 { min: 60, max: 79, label: 'Rendering inspection gallery...' },
 { min: 80, max: 94, label: 'Encrypting report...' },
 { min: 95, max: 100, label: 'Report Ready!' },
];

/**
 * Get completed projects from a list.
 */
export function getCompletedProjects(allProjects) {
 return allProjects.filter((p) => {
 if (p.milestones && p.milestones.length > 0) {
 return p.milestones.every((m) => m.status === 'completed');
 }
 return p.status === 'completed' || p.status === 'inspection_complete';
 });
}

/**
 * Get a project by ID from a list.
 */
export function getProjectById(projects, projectId) {
 if (!projectId) return null;
 return projects.find((p) => p.id === projectId) || null;
}

/**
 * Get preview pages based on checkbox state.
 */
export function getPreviewPages(checkboxState) {
 return REPORT_BLOCKS.filter((block) => checkboxState[block.id] === true);
}

/**
 * Get progress stage label for a given percentage.
 */
export function getProgressStage(progressPercent) {
 const stage = PROGRESS_STAGES.find(
 (s) => progressPercent >= s.min && progressPercent <= s.max
 );
 return stage ? stage.label : 'Processing...';
}

/**
 * Generate a unique report ID in format RPT-YYYY-NNNN.
 */
export function generateReportId() {
 const year = new Date().getFullYear();
 const num = Math.floor(1000 + Math.random() * 9000);
 return `RPT-${year}-${String(num).padStart(4, '0')}`;
}

/**
 * Check if user can proceed from a given step.
 */
export function canProceedFromStep(stepIndex, wizardState) {
 switch (stepIndex) {
 case 0:
 return wizardState.selectedProject !== null;
 case 1: {
 const cb = wizardState.checkboxState;
 return Object.values(cb).some((v) => v === true);
 }
 default:
 return true;
 }
}

/**
 * Get initial wizard state.
 */
export function getInitialWizardState() {
 return {
 currentStep: 0,
 selectedProject: null,
 checkboxState: {
 cover: true,
 map: true,
 gallery: true,
 table: true,
 signature: true,
 },
 progress: 0,
 isLoadingActive: false,
 isLoadingComplete: false,
 reportId: null,
 reportTimestamp: null,
 isModalOpen: false,
 modalCurrentPage: 0,
 toastMessage: null,
 toastType: 'success',
 isGeneratingPdf: false,
 };
}

/**
 * Reset wizard state (for "Generate Lagi").
 */
export function resetWizardState() {
 return getInitialWizardState();
}

/**
 * Format file size from bytes.
 */
export function formatFileSize(bytes) {
 if (bytes < 1024) return `${bytes} B`;
 if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
 return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get button aria-label for Big Button.
 */
export function getButtonAriaLabel(projectName) {
 return `Generate Inspection Report untuk ${projectName || 'proyek'}`;
}

/**
 * Validate if a projectId is valid and completed.
 */
export function isValidProjectId(projectId, completedProjects) {
 if (!projectId) return false;
 return completedProjects.some((p) => p.id === projectId);
}

/**
 * Get total estimated pages from checkbox state.
 */
export function getTotalPages(checkboxState) {
 return getPreviewPages(checkboxState).reduce((sum, p) => sum + p.estimatedPages, 0);
}
