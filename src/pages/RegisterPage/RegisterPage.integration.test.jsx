// Feature: auth-pages, Task 7.7: RegisterPage integration test
//
// Example-based integration test (NOT property-based). Exercises the
// composed RegisterPage flow with a real reducer, real children, and a
// MemoryRouter so we can drive the ?role= query param. The 3D scene
// inside AuthLayout is mocked out so jsdom doesn't have to spin up
// react-three-fiber.
//
// Validates: Requirements 1.6, 1.7, 1.7a, 7.8, 8.6, 8.7, 8.8, 14.2, 14.2a

import React from 'react';
import {
 describe,
 test,
 expect,
 beforeEach,
 afterEach,
 vi,
} from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Mock the heavy 3D shell so the test stays fast and jsdom-friendly ──
// AuthLayout is purely presentational; the form children we care about
// are passed as `children`, so a thin wrapper is enough.
vi.mock('../../components/AuthLayout.jsx', () => ({
 default: ({ children }) => (
 <div data-testid="auth-layout-mock">{children}</div>
 ),
}));

// ── Spy on useNavigate without losing the rest of react-router-dom ──
const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
 const actual = await importOriginal();
 return {
 ...actual,
 useNavigate: () => navigateMock,
 };
});

import RegisterPage from './RegisterPage.jsx';
import { AuthProvider } from '../../auth/AuthContext.jsx';

// ── Test harness ────────────────────────────────────────────────────────
// MemoryRouter lets us seed the URL (and thus the ?role= query) without
// touching window.history. AuthProvider is needed because
// VerificationStep calls useAuth() on submit.
function renderRegisterAt(initialEntry) {
 return render(
 <MemoryRouter initialEntries={[initialEntry]}>
 <AuthProvider>
 <RegisterPage />
 </AuthProvider>
 </MemoryRouter>,
 );
}

// Pilot Step 2 fields (from validators.STEP2_FIELDS.pilot + DataEntryForm).
// Used by both validation and success-path tests.
const PILOT_VALID = {
 'Nama Lengkap': 'Budi Pilot',
 Email: 'budi@example.com',
 'Nomor Telepon': '081234567890',
 Password: 'rahasia12',
 'Konfirmasi Password': 'rahasia12',
};

function fillPilotStep2(values) {
 for (const [label, value] of Object.entries(values)) {
 const input = screen.getByLabelText(label);
 fireEvent.change(input, { target: { value } });
 }
}

beforeEach(() => {
 navigateMock.mockReset();
 // Each test gets a clean session so AuthProvider hydrates to null.
 window.sessionStorage.clear();
});

afterEach(() => {
 vi.useRealTimers();
 vi.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────────────
// Case 1 — Valid query param ?role=pilot lands user on Step 2 with
// the pilot-specific field set rendered.
// Requirements: 1.6, 1.7
// ──────────────────────────────────────────────────────────────────────
describe('RegisterPage — query param routing', () => {
 test('?role=pilot mounts directly into Step 2 with pilot fields', () => {
 renderRegisterAt('/register?role=pilot');

 // Step 2 heading for pilot role.
 expect(
 screen.getByRole('heading', { name: /data pilot/i }),
 ).toBeInTheDocument();

 // All five pilot fields are present and labelled.
 expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument();
 expect(screen.getByLabelText('Email')).toBeInTheDocument();
 expect(screen.getByLabelText('Nomor Telepon')).toBeInTheDocument();
 expect(screen.getByLabelText('Password')).toBeInTheDocument();
 expect(screen.getByLabelText('Konfirmasi Password')).toBeInTheDocument();

 // Step 1 RoleSelector heading must NOT be in the DOM — we are past it.
 expect(
 screen.queryByRole('heading', { name: /pilih peran anda/i }),
 ).not.toBeInTheDocument();
 });

 // ────────────────────────────────────────────────────────────────────
 // Case 2 — Invalid ?role=foo is ignored; user stays on Step 1.
 // Requirements: 1.7a
 // ────────────────────────────────────────────────────────────────────
 test('?role=foo (invalid) keeps user on Step 1 with role cards visible', () => {
 renderRegisterAt('/register?role=foo');

 // Step 1 heading rendered.
 expect(
 screen.getByRole('heading', { name: /pilih peran anda/i }),
 ).toBeInTheDocument();

 // Both role cards are clickable buttons.
 expect(
 screen.getByRole('button', { name: /perusahaan/i }),
 ).toBeInTheDocument();
 expect(
 screen.getByRole('button', { name: /pilot \/ agensi/i }),
 ).toBeInTheDocument();

 // Step 2 heading should not be present.
 expect(
 screen.queryByRole('heading', { name: /data pilot/i }),
 ).not.toBeInTheDocument();
 expect(
 screen.queryByRole('heading', { name: /data perusahaan/i }),
 ).not.toBeInTheDocument();
 });
});

// ──────────────────────────────────────────────────────────────────────
// Case 3 — Step 2 validation: invalid input keeps user on Step 2 and
// surfaces inline error messages from validateStep2.
// Requirement: 7.8
// ──────────────────────────────────────────────────────────────────────
describe('RegisterPage — Step 2 validation gating', () => {
 test('clicking Lanjut with invalid data shows errors and stays on Step 2', () => {
 renderRegisterAt('/register?role=pilot');

 // Confirm Step 2.
 expect(
 screen.getByRole('heading', { name: /data pilot/i }),
 ).toBeInTheDocument();

 // Fill some fields with invalid data:
 // - email malformed
 // - phone way too short
 // - password too short
 // - confirmPassword mismatching
 // - leave Nama Lengkap empty
 fireEvent.change(screen.getByLabelText('Email'), {
 target: { value: 'not-an-email' },
 });
 fireEvent.change(screen.getByLabelText('Nomor Telepon'), {
 target: { value: '123' },
 });
 fireEvent.change(screen.getByLabelText('Password'), {
 target: { value: 'short' },
 });
 fireEvent.change(screen.getByLabelText('Konfirmasi Password'), {
 target: { value: 'different' },
 });

 fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));

 // Inline errors appear (exact copy from validators.js).
 expect(screen.getByText('Field ini wajib diisi')).toBeInTheDocument(); // fullName
 expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
 expect(screen.getByText('Nomor telepon tidak valid')).toBeInTheDocument();
 expect(screen.getByText('Password minimal 8 karakter')).toBeInTheDocument();
 expect(
 screen.getByText('Konfirmasi password tidak cocok'),
 ).toBeInTheDocument();

 // Still on Step 2 — Step 3 markers are absent.
 expect(
 screen.getByRole('heading', { name: /data pilot/i }),
 ).toBeInTheDocument();
 // Terms checkbox is the canonical Step 3 element.
 expect(
 screen.queryByLabelText(/syarat & ketentuan/i),
 ).not.toBeInTheDocument();
 expect(
 screen.queryByRole('button', { name: /^daftar$/i }),
 ).not.toBeInTheDocument();
 });
});

// ──────────────────────────────────────────────────────────────────────
// Helper — drive the form from Step 2 (pilot, valid data) into Step 3
// with a SIDOPI file present and terms accepted, so the submit path is
// the only thing left to exercise.
// ──────────────────────────────────────────────────────────────────────
function advanceToStep3WithPilotReady() {
 // Step 2: fill valid pilot data and click Lanjut.
 fillPilotStep2(PILOT_VALID);
 fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));

 // Now in Step 3. SidopiUpload is rendered for pilot role.
 // Provide a valid PDF file by dispatching a change on the file input.
 const fileInput = document.getElementById('sidopi-file');
 expect(fileInput).not.toBeNull();

 const goodFile = new File(['%PDF-1.4 mock'], 'sidopi.pdf', {
 type: 'application/pdf',
 });
 fireEvent.change(fileInput, { target: { files: [goodFile] } });

 // Accept terms.
 const termsBox = screen.getByLabelText(/syarat & ketentuan/i);
 fireEvent.click(termsBox);

 // Sanity: Daftar button is now enabled.
 const submitBtn = screen.getByRole('button', { name: /^daftar$/i });
 expect(submitBtn).not.toBeDisabled();
 return submitBtn;
}

// ──────────────────────────────────────────────────────────────────────
// Case 4 — Successful Step 3 submit navigates to /dashboard/{role}.
// Math.random < 0.95 → success. Mock returns 0.5 for success path.
// Requirements: 8.6, 8.7, 8.8
// ──────────────────────────────────────────────────────────────────────
describe('RegisterPage — Step 3 submit', () => {
 test('successful submit navigates to /dashboard/pilot and calls login', async () => {
 vi.useFakeTimers();
 const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

 renderRegisterAt('/register?role=pilot');
 const submitBtn = advanceToStep3WithPilotReady();

 fireEvent.click(submitBtn);

 // Drain the 800ms mock delay + any microtasks queued by the awaited promise.
 await act(async () => {
 await vi.advanceTimersByTimeAsync(800);
 });

 expect(navigateMock).toHaveBeenCalledTimes(1);
 expect(navigateMock).toHaveBeenCalledWith('/dashboard/pilot');

 // Session should have been written (proves login() ran).
 const stored = window.sessionStorage.getItem('siaga_auth');
 expect(stored).not.toBeNull();
 const parsed = JSON.parse(stored);
 expect(parsed.role).toBe('pilot');
 expect(parsed.email).toBe(PILOT_VALID.Email);

 randomSpy.mockRestore();
 });

 // ────────────────────────────────────────────────────────────────────
 // Case 5 — Failed submit shows banner copy and preserves Step 3 state.
 // Math.random < 0.95 → success, so 0.99 forces the failure branch.
 // Requirements: 14.2, 14.2a
 // ────────────────────────────────────────────────────────────────────
 test('failed submit surfaces banner and preserves Step 3 state', async () => {
 vi.useFakeTimers();
 const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);

 renderRegisterAt('/register?role=pilot');
 const submitBtn = advanceToStep3WithPilotReady();

 fireEvent.click(submitBtn);

 await act(async () => {
 await vi.advanceTimersByTimeAsync(800);
 });

 // Failure banner copy (exact string from VerificationStep).
 expect(
 screen.getByText('Pendaftaran gagal, silakan coba lagi'),
 ).toBeInTheDocument();

 // No navigation occurred.
 expect(navigateMock).not.toHaveBeenCalled();

 // No session was written.
 expect(window.sessionStorage.getItem('siaga_auth')).toBeNull();

 // Form state preserved: still Step 3 (terms checkbox still visible),
 // file info still rendered, Daftar button still present.
 expect(screen.getByLabelText(/syarat & ketentuan/i)).toBeInTheDocument();
 expect(screen.getByTestId('sidopi-file-info')).toBeInTheDocument();
 expect(screen.getByText('sidopi.pdf')).toBeInTheDocument();
 expect(
 screen.getByRole('button', { name: /^daftar$/i }),
 ).toBeInTheDocument();

 // Terms still checked → submit gate would still be enabled, proving
 // termsAccepted survived the failure .
 expect(screen.getByLabelText(/syarat & ketentuan/i)).toBeChecked();

 randomSpy.mockRestore();
 });
});
