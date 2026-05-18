/**
 * Centralized route paths and pure routing helpers for the auth-pages feature.
 *
 * This module is intentionally side-effect free so it can be unit-tested and
 * property-tested without a DOM, router, or sessionStorage. Components import
 * from here as the single source of truth for auth-related paths and the
 * derivation rules between auth session state and dashboard routes.
 *
 * Feature: auth-pages
 * Validates: Requirements 1.1, 1.2, 1.3, 13.1, 13.2, 13.4, 13.5, 13.6
 * Property 8: ProtectedRoute redirect logic is consistent (pickRedirect totality)
 */

/**
 * Canonical path constants for every route owned or referenced by the
 * auth-pages feature. Centralizing avoids string drift between the router
 * config, navigation calls, and tests.
 *
 * @type {{
 *   ROOT: '/',
 *   LOGIN: '/login',
 *   REGISTER: '/register',
 *   DASHBOARD_CLIENT: '/dashboard/client',
 *   DASHBOARD_PILOT: '/dashboard/pilot',
 * }}
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 13.1, 13.2
 */
export const ROUTES = Object.freeze({
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD_CLIENT: '/dashboard/client',
  DASHBOARD_PILOT: '/dashboard/pilot',
});

/**
 * Map a role to its dashboard route path.
 *
 * Pure, total over the role union {'client', 'pilot'}. For inputs outside the
 * union the function returns `null` so callers can detect misuse without an
 * exception (e.g. when a malformed query parameter accidentally reaches here).
 *
 * @param {'client' | 'pilot' | string | null | undefined} role
 * @returns {string | null} Dashboard path for known roles, `null` otherwise.
 *
 * Validates: Requirements 13.1, 13.2
 */
export function roleToDashboardPath(role) {
  if (role === 'client') return ROUTES.DASHBOARD_CLIENT;
  if (role === 'pilot') return ROUTES.DASHBOARD_PILOT;
  return null;
}

/**
 * Decide where ProtectedRoute should send a user given the current session
 * and the role that the requested route demands.
 *
 * Decision table:
 *   - `session === null`              → `'/login'`            (no session)
 *   - `session.role === requestedRole` → `null`               (allow render)
 *   - `session.role !== requestedRole` → `/dashboard/<session.role>` (wrong role)
 *
 * The function is total over its declared input domain and never throws.
 * Defensive branches handle non-conforming inputs (e.g. session object
 * without a recognized `role`) by falling back to `'/login'`, treating the
 * session as effectively absent rather than crashing the router.
 *
 * @param {{ role: 'client' | 'pilot', email?: string, ts?: number } | null | undefined} session
 * @param {'client' | 'pilot'} requestedRole
 * @returns {string | null} Path to redirect to, or `null` to allow the render.
 *
 * Validates: Requirements 13.4, 13.5, 13.6
 * Property 8: pickRedirect is total and consistent.
 */
export function pickRedirect(session, requestedRole) {
  // Treat null/undefined session as "not logged in".
  if (session === null || session === undefined) {
    return ROUTES.LOGIN;
  }

  // Defensive: a malformed session without a recognized role is also
  // treated as "not logged in" so the function stays total.
  const sessionRole = session.role;
  const sessionDashboard = roleToDashboardPath(sessionRole);
  if (sessionDashboard === null) {
    return ROUTES.LOGIN;
  }

  // Matching role → allow render.
  if (sessionRole === requestedRole) {
    return null;
  }

  // Mismatched role → bounce to the session's own dashboard.
  return sessionDashboard;
}
