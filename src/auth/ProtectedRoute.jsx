import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { pickRedirect } from './routes.js';
import { getLoginRedirectPath } from '../routes/appRoutes.js';

/**
 * Route guard that restricts access based on the current auth session and
 * the role required by the wrapped route.
 *
 * Behavior:
 *   - No session → redirect to /login?redirect=currentPath (preserves target)
 *   - Session role matches → render children
 *   - Session role mismatch → redirect to session's own dashboard
 *
 * Supports multi-role access: requestedRole can be a string or an array of strings.
 * When an array is provided, access is granted if the session role matches ANY of the roles.
 *
 * Feature: auth-pages
 * Validates: Requirements 13.4, 13.5, 13.6
 *
 * @param {{ requestedRole: string | string[], children: React.ReactNode }} props
 */
export default function ProtectedRoute({ requestedRole, children }) {
  const { session } = useAuth();
  const location = useLocation();

  // Build the current full path for redirect purposes
  const currentPath = location.pathname + location.search;

  // Support multi-role: if requestedRole is an array, check if session role matches any
  if (Array.isArray(requestedRole)) {
    if (!session || !session.role) {
      return <Navigate to={getLoginRedirectPath(currentPath)} replace />;
    }
    if (requestedRole.includes(session.role)) {
      return children;
    }
    // Role mismatch — redirect to their own dashboard
    const redirect = pickRedirect(session, requestedRole[0]);
    return <Navigate to={redirect || getLoginRedirectPath(currentPath)} replace />;
  }

  // Original single-role behavior
  const redirect = pickRedirect(session, requestedRole);

  if (redirect === null) {
    return children;
  }

  // If redirect is to /login, append the redirect query param
  if (redirect === '/login') {
    return <Navigate to={getLoginRedirectPath(currentPath)} replace />;
  }

  return <Navigate to={redirect} replace />;
}
