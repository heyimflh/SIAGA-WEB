export const ROUTES = Object.freeze({
 ROOT: '/',
 LOGIN: '/login',
 REGISTER: '/register',
 DASHBOARD_CLIENT: '/dashboard/client',
 DASHBOARD_PILOT: '/dashboard/pilot',
});

export function roleToDashboardPath(role) {
 if (role === 'client') return ROUTES.DASHBOARD_CLIENT;
 if (role === 'pilot') return ROUTES.DASHBOARD_PILOT;
 return null;
}

export function pickRedirect(session, requestedRole) {

 if (session === null || session === undefined) {
 return ROUTES.LOGIN;
 }

 const sessionRole = session.role;
 const sessionDashboard = roleToDashboardPath(sessionRole);
 if (sessionDashboard === null) {
 return ROUTES.LOGIN;
 }

 if (sessionRole === requestedRole) {
 return null;
 }

 return sessionDashboard;
}
