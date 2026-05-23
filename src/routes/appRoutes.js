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

export function getRegisterPath(role, extraQuery = '') {
 const base = `${ROUTES.register}?role=${role}`;
 return extraQuery ? `${base}&${extraQuery}` : base;
}

export function getLoginRedirectPath(target) {
 return `${ROUTES.login}?redirect=${encodeURIComponent(target)}`;
}
