// Feature: auth-pages, Task 8.3: Smoke test for App router wiring (memory-router)
//
// Example-based smoke test — NOT property-based. Verifies that the route
// table + AuthProvider + ProtectedRoute compose correctly end-to-end:
//   1. /login                         → LoginPage renders.
//   2. /register?role=pilot           → RegisterPage lands on Step 2 with
//                                       pilot-specific fields.
//   3. /dashboard/client (no session) → user is redirected to /login.
//   4. /dashboard/pilot (logged in as client via sessionStorage) → user is
//                                       redirected to /dashboard/client.
//
// The test does NOT import App.jsx directly because App.jsx hard-wires a
// <BrowserRouter>, which can't be driven from initialEntries. Instead, it
// rebuilds the same route table inside a <MemoryRouter>, mirroring the
// layering App.jsx uses (BrowserRouter → AuthProvider → Routes). This is
// the same approach recommended by react-router for testing route trees.
//
// Validates: Requirements 1.1, 1.2, 1.6, 13.4, 13.5

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

// Mock the heavy 3D scene so jsdom doesn't try to mount react-three-fiber.
// The lazy import inside AuthLayout resolves to this default export.
vi.mock('./components/AuthDroneScene', () => ({
  default: () => <div data-testid="mock-drone-scene" />,
  // Real module also exports an error boundary; provide a passthrough.
  AuthDroneErrorBoundary: ({ children }) => <>{children}</>,
}));

import AuthProvider from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import ClientDashboard from './pages/DashboardPlaceholder/ClientDashboard.jsx';
import PilotDashboard from './pages/DashboardPlaceholder/PilotDashboard.jsx';

const SESSION_KEY = 'siaga_auth';

/**
 * TestApp — mirrors the route table from src/App.jsx but uses
 * MemoryRouter so the test can seed `initialEntries`. Page transitions
 * (Framer Motion) are intentionally skipped here because they are
 * orthogonal to the routing wiring under test and add async noise.
 */
function TestApp({ initialEntries }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute requestedRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pilot"
            element={
              <ProtectedRoute requestedRole="pilot">
                <PilotDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  // Always start from a clean session so the AuthProvider hydrates to null
  // unless the test explicitly seeds a logged-in state.
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.clear();
  }
});

afterEach(() => {
  cleanup();
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.clear();
  }
  vi.restoreAllMocks();
});

describe('App router smoke test (memory-router)', () => {
  // ────────────────────────────────────────────────────────────────────
  // Case 1 — /login renders LoginPage.
  // Requirements: 1.1
  // ────────────────────────────────────────────────────────────────────
  it('/login renders LoginPage', () => {
    render(<TestApp initialEntries={['/login']} />);

    // The LoginPage heading is the canonical visible marker.
    expect(
      screen.getByRole('heading', { name: /masuk ke akun siaga/i }),
    ).toBeInTheDocument();
  });

  // ────────────────────────────────────────────────────────────────────
  // Case 2 — /register?role=pilot lands directly on Step 2 with pilot
  // fields visible (RoleSelector reads ?role= once on mount).
  // Requirements: 1.2, 1.6
  // ────────────────────────────────────────────────────────────────────
  it('/register?role=pilot renders Step 2 with pilot fields', () => {
    render(<TestApp initialEntries={['/register?role=pilot']} />);

    // Step 2 heading for the pilot branch.
    expect(
      screen.getByRole('heading', { name: /data pilot/i }),
    ).toBeInTheDocument();

    // Pilot-specific field unique to Step 2 / pilot role.
    expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Nomor Telepon')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Konfirmasi Password')).toBeInTheDocument();
  });

  // ────────────────────────────────────────────────────────────────────
  // Case 3 — /dashboard/client without a session redirects to /login.
  // ProtectedRoute calls pickRedirect(null, 'client') → '/login'.
  // Requirements: 13.4
  // ────────────────────────────────────────────────────────────────────
  it('/dashboard/client without a session redirects to /login', () => {
    render(<TestApp initialEntries={['/dashboard/client']} />);

    // We should land on LoginPage, not ClientDashboard.
    expect(
      screen.getByRole('heading', { name: /masuk ke akun siaga/i }),
    ).toBeInTheDocument();

    // Negative assertion: ClientDashboard heading must NOT be in the DOM.
    expect(
      screen.queryByRole('heading', { name: /client dashboard/i }),
    ).not.toBeInTheDocument();
  });

  // ────────────────────────────────────────────────────────────────────
  // Case 4 — Logged in as client → /dashboard/pilot redirects to
  // /dashboard/client. ProtectedRoute calls
  // pickRedirect({role:'client',...}, 'pilot') → '/dashboard/client'.
  // Requirements: 13.5
  // ────────────────────────────────────────────────────────────────────
  it('/dashboard/pilot while logged in as client redirects to /dashboard/client', () => {
    // Seed a client session BEFORE rendering so AuthProvider hydrates
    // from sessionStorage in its useState initializer.
    window.sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        role: 'client',
        email: 'client@example.com',
        ts: Date.now(),
      }),
    );

    render(<TestApp initialEntries={['/dashboard/pilot']} />);

    // We should land on ClientDashboard, not PilotDashboard.
    expect(
      screen.getByRole('heading', { name: /client dashboard/i }),
    ).toBeInTheDocument();

    // Negative assertions: neither PilotDashboard nor LoginPage rendered.
    expect(
      screen.queryByRole('heading', { name: /pilot dashboard/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /masuk ke akun siaga/i }),
    ).not.toBeInTheDocument();
  });
});
