// Feature: auth-pages, Property 7: Role round-trip from form to session to dashboard
//
// Validates: Requirements 4.10, 13.1, 13.2, 13.3
//
// Property statement:
//   For ANY role r ∈ {'client', 'pilot'} and any email string, after calling
//   AuthContext's `login({ role: r, email })`:
//     1. The role read back from `useAuth().session.role` equals r.
//     2. The role persisted at `sessionStorage.siaga_auth.role` (parsed) equals r.
//     3. `roleToDashboardPath(readRole) === '/dashboard/' + r`.
//   This means the role chosen at the form submits intact through the session
//   layer and routes deterministically to the correct dashboard path.

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { act, renderHook } from '@testing-library/react';
import fc from 'fast-check';

import { AuthProvider, useAuth } from './AuthContext.jsx';
import { roleToDashboardPath } from './routes.js';

const STORAGE_KEY = 'siaga_auth';

// Reset sessionStorage between iterations so each fast-check run starts from a
// clean slate. fast-check re-runs the predicate many times in a single test.
beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  window.sessionStorage.clear();
});

const wrapper = ({ children }) => createElement(AuthProvider, null, children);

describe('Property 7: Role round-trip from form to session to dashboard', () => {
  test('login(role) round-trips through useAuth, sessionStorage, and roleToDashboardPath', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('client', 'pilot'),
        // Generate arbitrary email strings; the round-trip property is over
        // role specifically, but we keep email arbitrary to ensure it does
        // not interfere with role persistence.
        fc.string({ minLength: 0, maxLength: 64 }),
        (role, email) => {
          // Fresh state for every iteration.
          window.sessionStorage.clear();

          const { result, unmount } = renderHook(() => useAuth(), { wrapper });

          // Sanity precondition: no session before login.
          expect(result.current.session).toBeNull();

          act(() => {
            result.current.login({ role, email });
          });

          // 1. Role round-trips through the React context (useAuth).
          const sessionRole = result.current.session?.role;
          expect(sessionRole).toBe(role);

          // 2. Role round-trips through sessionStorage under the agreed key.
          const raw = window.sessionStorage.getItem(STORAGE_KEY);
          expect(raw).not.toBeNull();
          const parsed = JSON.parse(raw);
          expect(parsed.role).toBe(role);

          // 3. The role we read back maps to the correct dashboard path.
          expect(roleToDashboardPath(sessionRole)).toBe(`/dashboard/${role}`);
          expect(roleToDashboardPath(parsed.role)).toBe(`/dashboard/${role}`);

          // Cleanup so the next iteration starts from a clean React tree.
          unmount();
          window.sessionStorage.clear();
        }
      ),
      // Lower than 100 because each iteration mounts and unmounts a React
      // tree; 50 still gives strong coverage over the (role, email) space.
      { numRuns: 50 }
    );
  });
});
