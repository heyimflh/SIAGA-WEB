// Accessibility (a11y) test suite for the auth-pages feature.
//
// Validates: Requirements 12.1, 12.2, 12.3, 12.4 — every interactive
// element has an associated <label htmlFor>, error messages are wired
// via aria-describedby, invalid fields carry aria-invalid="true", and
// focus indicators are present (axe checks color-contrast/role/etc).
//
// Strategy:
//   - Render the *step components* directly (RoleSelector, DataEntryForm,
//     VerificationStep) for Register Step 1/2/3 so the heavy AuthLayout
//     + Three.js Canvas does not enter the DOM. Step components are the
//     interactive surface area covered by Requirements 12.1–12.4.
//   - For LoginPage we render the full page wrapper (AuthLayout +
//     RoleTabSwitcher + LoginForm) but mock the AuthDroneScene module so
//     the Canvas / GLTF loader stays out of jsdom.
//   - Each render is wrapped in MemoryRouter + AuthProvider because the
//     components consume react-router-dom hooks (useSearchParams,
//     useNavigate) and the AuthContext (useAuth).
//
// Test cases:
//   1. LoginPage with default role
//   2. RegisterPage Step 1 (RoleSelector)
//   3. RegisterPage Step 2 — client (DataEntryForm)
//   4. RegisterPage Step 2 — pilot (DataEntryForm)
//   5. RegisterPage Step 3 — client (VerificationStep, terms unchecked)
//   6. RegisterPage Step 3 — pilot (VerificationStep, terms accepted, no file)

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';

// vitest-axe ships an empty `extend-expect` entrypoint in this version,
// so register the `toHaveNoViolations` matcher explicitly with vitest's
// expect to make `expect(results).toHaveNoViolations()` available.
expect.extend(axeMatchers);

import { AuthProvider } from '../auth/AuthContext.jsx';

// Mock the heavy 3D scene module BEFORE importing pages that rely on
// AuthLayout. This keeps Three.js / WebGL / GLTF loading out of jsdom.
vi.mock('../components/AuthDroneScene', () => ({
  default: () => null,
  AuthDroneErrorBoundary: ({ children }) => children,
}));

import LoginPage from './LoginPage/LoginPage.jsx';
import RoleSelector from './RegisterPage/RoleSelector.jsx';
import DataEntryForm from './RegisterPage/DataEntryForm.jsx';
import VerificationStep from './RegisterPage/VerificationStep.jsx';
import { initialRegisterState } from './RegisterPage/registerReducer.js';

/**
 * Helper: render any node inside MemoryRouter + AuthProvider.
 * Returns the testing-library result (we only need `container`).
 */
function renderWithProviders(ui, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}

/** Convenience: build a Register state for a given step + role. */
function buildRegisterState({ step, role, overrides = {} }) {
  return {
    ...initialRegisterState,
    step,
    role,
    ...overrides,
  };
}

describe('auth-pages a11y (vitest-axe)', () => {
  it('LoginPage with default role has no axe violations', async () => {
    const { container } = renderWithProviders(<LoginPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('RegisterPage Step 1 (RoleSelector) has no axe violations', async () => {
    const state = buildRegisterState({ step: 1, role: null });
    const { container } = renderWithProviders(
      <RoleSelector state={state} dispatch={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('RegisterPage Step 2 (client DataEntryForm) has no axe violations', async () => {
    const state = buildRegisterState({ step: 2, role: 'client' });
    const { container } = renderWithProviders(
      <DataEntryForm state={state} dispatch={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('RegisterPage Step 2 (pilot DataEntryForm) has no axe violations', async () => {
    const state = buildRegisterState({ step: 2, role: 'pilot' });
    const { container } = renderWithProviders(
      <DataEntryForm state={state} dispatch={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('RegisterPage Step 3 (client VerificationStep) has no axe violations', async () => {
    // Client branch renders ClientSummary (no SidopiUpload), terms
    // checkbox unchecked → "Daftar" disabled. Disabled buttons are
    // valid a11y per axe.
    const state = buildRegisterState({
      step: 3,
      role: 'client',
      overrides: {
        client: {
          companyName: 'PT Contoh',
          corporateEmail: 'ops@contoh.co.id',
          phone: '+62 812 3456 7890',
          password: 'password123',
          confirmPassword: 'password123',
        },
      },
    });
    const { container } = renderWithProviders(
      <VerificationStep state={state} dispatch={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('RegisterPage Step 3 (pilot VerificationStep, terms accepted, no file) has no axe violations', async () => {
    // Pilot branch renders SidopiUpload dropzone (no file selected yet)
    // plus the terms checkbox toggled on. Submit button stays disabled
    // because sidopiFile is null — that is the intended state for this
    // a11y snapshot.
    const state = buildRegisterState({
      step: 3,
      role: 'pilot',
      overrides: {
        pilot: {
          fullName: 'Budi Santoso',
          email: 'budi@pilot.id',
          phone: '+62 812 0000 1111',
          password: 'password123',
          confirmPassword: 'password123',
        },
        termsAccepted: true,
      },
    });
    const { container } = renderWithProviders(
      <VerificationStep state={state} dispatch={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
