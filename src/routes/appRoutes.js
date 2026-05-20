/**
 * Centralized route constants for the entire SIAGA application.
 * All components should import paths from here to avoid string drift.
 */

export const ROUTES = {
  home: '/',
  howItWorks: '/how-it-works',
  pricing: '/pricing',
  pilots: '/pilots',
  login: '/login',
  register: '/register',
  clientDashboard: '/dashboard/client',
  clientProjects: '/dashboard/client/projects',
  clientAssetMap: '/dashboard/client/asset-map',
  clientBidding: '/dashboard/client/bidding',
  clientSettings: '/dashboard/client/settings',
  clientCreateProject: '/dashboard/client/create-project',
  clientReportGenerator: '/dashboard/client/report-generator',
  pilotDashboard: '/dashboard/pilot',
  pilotJobRadar: '/dashboard/pilot/job-radar',
  projectDetail: (projectId = ':projectId') => `/project/${projectId}`,
};

/**
 * Build register path with role and optional extra query params.
 * @param {'client'|'pilot'} role
 * @param {string} [extraQuery] - e.g. 'plan=basic'
 * @returns {string}
 */
export function getRegisterPath(role, extraQuery = '') {
  const base = `${ROUTES.register}?role=${role}`;
  return extraQuery ? `${base}&${extraQuery}` : base;
}

/**
 * Build login path with redirect target.
 * @param {string} target - the path to redirect to after login
 * @returns {string}
 */
export function getLoginRedirectPath(target) {
  return `${ROUTES.login}?redirect=${encodeURIComponent(target)}`;
}
