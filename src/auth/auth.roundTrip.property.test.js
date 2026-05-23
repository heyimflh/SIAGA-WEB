import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { act, renderHook } from '@testing-library/react';
import fc from 'fast-check';

import { AuthProvider, useAuth } from './AuthContext.jsx';
import { roleToDashboardPath } from './routes.js';

const STORAGE_KEY = 'siaga_auth';

beforeEach(() => {
 window.sessionStorage.clear();
});

afterEach(() => {
 window.sessionStorage.clear();
});

const wrapper = ({ children }) => createElement(AuthProvider, null, children);

describe('Role round-trip from form to session to dashboard', () => {
 test('login(role) round-trips through useAuth, sessionStorage, and roleToDashboardPath', () => {
 fc.assert(
 fc.property(
 fc.constantFrom('client', 'pilot'),

 fc.string({ minLength: 0, maxLength: 64 }),
 (role, email) => {

 window.sessionStorage.clear();

 const { result, unmount } = renderHook(() => useAuth(), { wrapper });

 expect(result.current.session).toBeNull();

 act(() => {
 result.current.login({ role, email });
 });

 const sessionRole = result.current.session?.role;
 expect(sessionRole).toBe(role);

 const raw = window.sessionStorage.getItem(STORAGE_KEY);
 expect(raw).not.toBeNull();
 const parsed = JSON.parse(raw);
 expect(parsed.role).toBe(role);

 expect(roleToDashboardPath(sessionRole)).toBe(`/dashboard/${role}`);
 expect(roleToDashboardPath(parsed.role)).toBe(`/dashboard/${role}`);

 unmount();
 window.sessionStorage.clear();
 }
 ),

 { numRuns: 50 }
 );
 });
});
