// Feature: auth-pages
// Integration test for LoginPage — covers render + fill + submit flows.
//
// Validates: Requirements 4.8, 4.9, 4.10, 5.7, 5.8, 5.9, 14.1, 14.3, 14.4
//
// Coverage:
//   1. Validation error on submit with empty fields → inline errors visible,
//      NO loading state, navigate not called (Req 5.7, 5.8, 5.9, 14.3).
//   2. Submit with valid credentials (success path) → AuthContext.login
//      called with {role, email}; navigate to /dashboard/client (Req 4.9, 4.10, 14.1).
//   3. Submit failure path → global banner "Login gagal, silakan coba lagi"
//      shown and isSubmitting reset (Req 4.8, 14.1).
//   4. Double-submit guard → submit handler only fires once during loading
//      (Req 14.4).
//
// This is example-based, NOT property-based. Uses Vitest + @testing-library/react
// with fireEvent (no @testing-library/user-event dependency).

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the heavy AuthLayout / AuthDroneScene so jsdom doesn't try to mount
// react-three-fiber and the lazy chunk. We only care about the form area.
vi.mock('../../components/AuthLayout.jsx', () => ({
  default: ({ children }) => <div data-testid="mock-auth-layout">{children}</div>,
}));

import LoginPage from './LoginPage.jsx';
import { AuthProvider } from '../../auth/AuthContext.jsx';

// ── Test wrapper that mounts LoginPage at /login and a probe for the
// dashboard routes so we can assert that navigation succeeded by reading
// the DOM rather than spying on react-router internals.
function renderLoginPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/client"
            element={<div data-testid="dashboard-client">Client Dashboard</div>}
          />
          <Route
            path="/dashboard/pilot"
            element={<div data-testid="dashboard-pilot">Pilot Dashboard</div>}
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

// Helper to fill the email + password fields.
function fillCredentials({ email, password }) {
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
}

function getSubmitButton() {
  return screen.getByRole('button', { name: /masuk|memproses/i });
}

describe('LoginPage integration', () => {
  beforeEach(() => {
    // Clean session storage between tests to avoid bleed.
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.clear();
    }
    // shouldAdvanceTime keeps real wall-clock advancing so RTL's waitFor
    // polling still works while we control the form's 800ms setTimeout.
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    cleanup();
  });

  it('shows validation errors on empty submit and does NOT enter loading state', async () => {
    renderLoginPage();

    const submitBtn = getSubmitButton();

    // Submit with empty fields.
    fireEvent.click(submitBtn);

    // Inline validation errors must appear.
    expect(screen.getByText('Email wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('Password wajib diisi')).toBeInTheDocument();

    // The button should NOT have entered the loading state.
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).not.toHaveAttribute('aria-busy', 'true');
    expect(submitBtn).toHaveTextContent('Masuk');

    // No navigation occurred — the dashboard probe should not be mounted.
    expect(screen.queryByTestId('dashboard-client')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-pilot')).not.toBeInTheDocument();

    // No global error banner either.
    expect(screen.queryByText('Login gagal, silakan coba lagi')).not.toBeInTheDocument();
  });

  it('submits valid credentials, calls login and navigates to /dashboard/client', async () => {
    // Force the success branch: Math.random() returns >= 0.05.
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    renderLoginPage();

    fillCredentials({ email: 'user@example.com', password: 'secret123' });

    fireEvent.click(getSubmitButton());

    // Submit button switches to loading state immediately.
    const loadingBtn = screen.getByRole('button', { name: /memproses/i });
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute('aria-busy', 'true');

    // Fast-forward the 800ms mock delay and let the awaited promise resolve.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    // Default role is 'client' → expect navigation to /dashboard/client.
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-client')).toBeInTheDocument();
    });

    // Assert that login() persisted the session (proxy for "login was called
    // with {role, email}"). The provider writes role + email to sessionStorage.
    const raw = window.sessionStorage.getItem('siaga_auth');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    expect(parsed.role).toBe('client');
    expect(parsed.email).toBe('user@example.com');
  });

  it('shows the global error banner and resets loading on submit failure', async () => {
    // Force the failure branch: Math.random() returns < 0.05.
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    renderLoginPage();

    fillCredentials({ email: 'user@example.com', password: 'secret123' });

    fireEvent.click(getSubmitButton());

    // Loading state engaged.
    expect(screen.getByRole('button', { name: /memproses/i })).toBeDisabled();

    // Advance through the 800ms mock delay.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    // Banner appears.
    await waitFor(() => {
      expect(screen.getByText('Login gagal, silakan coba lagi')).toBeInTheDocument();
    });

    // Loading state was reset — button is back to "Masuk" and enabled.
    const submitBtn = screen.getByRole('button', { name: /masuk/i });
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).not.toHaveAttribute('aria-busy', 'true');

    // Session was NOT created.
    expect(window.sessionStorage.getItem('siaga_auth')).toBeNull();

    // No navigation occurred.
    expect(screen.queryByTestId('dashboard-client')).not.toBeInTheDocument();
  });

  it('double-click on submit only triggers a single login attempt', async () => {
    renderLoginPage();

    fillCredentials({ email: 'user@example.com', password: 'secret123' });

    const submitBtn = getSubmitButton();

    // Spy on setTimeout AFTER setup so we only count timers scheduled by
    // the submit handler. The form's mock-auth delay is exactly 800ms, and
    // each accepted submit attempt schedules one such timer.
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    // Force the success branch deterministically (Req 14.1).
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    // Two clicks with an act-flushed render in between (mimics a fast
    // user double-click after the browser has repainted the disabled state).
    // The second click must be rejected by the synchronous in-flight guard
    // inside handleSubmit (Req 14.4).
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Exactly one 800ms timer was scheduled — the second submit was
    // rejected by the in-flight guard before reaching the mock-delay step.
    const submitDelayCalls = setTimeoutSpy.mock.calls.filter(
      ([, delay]) => delay === 800
    );
    expect(submitDelayCalls).toHaveLength(1);

    // Drain the 800ms delay scheduled by the (single) accepted submit.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    // Observable outcome: the user is on the dashboard and the session
    // was persisted exactly once with the submitted email — proxy for
    // "login() invoked once".
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-client')).toBeInTheDocument();
    });

    const raw = window.sessionStorage.getItem('siaga_auth');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    expect(parsed.email).toBe('user@example.com');
    expect(parsed.role).toBe('client');
  });
});
