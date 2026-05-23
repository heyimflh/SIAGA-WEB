import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { pickRedirect } from './routes.js';
import { getLoginRedirectPath } from '../routes/appRoutes.js';

export default function ProtectedRoute({ requestedRole, children }) {
 const { session } = useAuth();
 const location = useLocation();

 const currentPath = location.pathname + location.search;

 if (Array.isArray(requestedRole)) {
 if (!session || !session.role) {
 return <Navigate to={getLoginRedirectPath(currentPath)} replace />;
 }
 if (requestedRole.includes(session.role)) {
 return children;
 }

 const redirect = pickRedirect(session, requestedRole[0]);
 return <Navigate to={redirect || getLoginRedirectPath(currentPath)} replace />;
 }

 const redirect = pickRedirect(session, requestedRole);

 if (redirect === null) {
 return children;
 }

 if (redirect === '/login') {
 return <Navigate to={getLoginRedirectPath(currentPath)} replace />;
 }

 return <Navigate to={redirect} replace />;
}
