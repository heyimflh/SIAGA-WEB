import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { pickRedirect } from './routes.js';

/**
 * Route guard that restricts access based on the current auth session and
 * the role required by the wrapped route.
 *
 * Behavior is delegated to the pure `pickRedirect` helper:
 *   - `pickRedirect` returns `null`  → render `children` (access allowed).
 *   - `pickRedirect` returns a path  → render `<Navigate to={path} replace />`.
 *
 * Using `replace` keeps the browser history clean so users don't get stuck
 * bouncing back to a guarded route via the back button.
 *
 * Feature: auth-pages
 * Validates: Requirements 13.4, 13.5, 13.6
 *
 * @param {{ requestedRole: 'client' | 'pilot', children: React.ReactNode }} props
 */
export default function ProtectedRoute({ requestedRole, children }) {
  const { session } = useAuth();
  const redirect = pickRedirect(session, requestedRole);

  if (redirect === null) {
    return children;
  }

  return <Navigate to={redirect} replace />;
}
