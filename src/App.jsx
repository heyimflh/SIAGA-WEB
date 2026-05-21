import {
 BrowserRouter,
 Routes,
 Route,
 Navigate,
 useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthProvider from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import ScrollToHash from './components/ScrollToHash.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import ClientDashboardPage from './pages/ClientDashboard/ClientDashboardPage';
import DashboardErrorBoundary from './pages/ClientDashboard/DashboardErrorBoundary';
import CreateProjectComingSoon from './pages/ClientDashboard/CreateProjectComingSoon';
import ProjectListPage from './pages/ClientDashboard/ProjectListPage';
import AssetMapPage from './pages/ClientDashboard/AssetMapPage';
import BiddingPage from './pages/ClientDashboard/BiddingPage';
import SettingsPage from './pages/ClientDashboard/SettingsPage';
import ReportGeneratorPage from './pages/ReportGenerator/ReportGeneratorPage.jsx';
import PilotDashboardPage from './pages/PilotDashboard/PilotDashboardPage.jsx';
import JobRadarPage from './pages/JobRadar/JobRadarPage.jsx';
import ProjectDetailPage from './pages/ProjectDetail/ProjectDetailPage.jsx';
import BrowsePilotsPage from './pages/BrowsePilots/BrowsePilotsPage.jsx';
import HowItWorksPage from './pages/HowItWorks/HowItWorksPage.jsx';
import PricingPage from './pages/Pricing/PricingPage.jsx';
import PageTransition from './components/PageTransition.jsx';
import CustomCursor from './components/CustomCursor';
import './index.css';

/**
 * AnimatedRoutes — inner component that owns the Routes tree.
 *
 * Splitting this out is necessary because `useLocation()` (needed to key
 * `<AnimatePresence>` for proper enter/exit animations on route changes)
 * must be called inside a `<BrowserRouter>` ancestor. The outer App
 * component below provides that router boundary.
 *
 * `mode="wait"` ensures the exiting route finishes its exit animation
 * before the entering route mounts, which matches the page transition
 * variants defined in `PageTransition.jsx` (fade + slide-up).
 */
function AnimatedRoutes() {
 const location = useLocation();

 return (
 <AnimatePresence mode="wait">
 <Routes location={location} key={location.pathname}>
 <Route path="/" element={<LandingPage />} />

 <Route
 path="/login"
 element={
 <PageTransition routeKey="login">
 <LoginPage />
 </PageTransition>
 }
 />

 <Route
 path="/register"
 element={
 <PageTransition routeKey="register">
 <RegisterPage />
 </PageTransition>
 }
 />

 <Route
 path="/pilots"
 element={
 <PageTransition routeKey="browse-pilots">
 <BrowsePilotsPage />
 </PageTransition>
 }
 />

 <Route
 path="/dashboard/client"
 element={
 <ProtectedRoute requestedRole="client">
 <PageTransition routeKey="dashboard-client">
 <DashboardErrorBoundary>
 <ClientDashboardPage />
 </DashboardErrorBoundary>
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/client/create-project"
 element={
 <ProtectedRoute requestedRole="client">
 <PageTransition routeKey="create-project">
 <CreateProjectComingSoon />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/client/projects"
 element={
 <ProtectedRoute requestedRole="client">
 <PageTransition routeKey="client-projects">
 <ProjectListPage />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/client/asset-map"
 element={
 <ProtectedRoute requestedRole="client">
 <AssetMapPage />
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/client/bidding"
 element={
 <ProtectedRoute requestedRole="client">
 <PageTransition routeKey="client-bidding">
 <BiddingPage />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/client/settings"
 element={
 <ProtectedRoute requestedRole="client">
 <PageTransition routeKey="client-settings">
 <SettingsPage />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/client/report-generator"
 element={
 <ProtectedRoute requestedRole="client">
 <PageTransition routeKey="report-generator">
 <ReportGeneratorPage />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/pilot"
 element={
 <ProtectedRoute requestedRole="pilot">
 <PageTransition routeKey="dashboard-pilot">
 <PilotDashboardPage />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/dashboard/pilot/job-radar"
 element={
 <ProtectedRoute requestedRole="pilot">
 <PageTransition routeKey="job-radar">
 <JobRadarPage />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/project/:projectId"
 element={
 <ProtectedRoute requestedRole={["client", "pilot"]}>
 <PageTransition routeKey="project-detail">
 <ProjectDetailPage />
 </PageTransition>
 </ProtectedRoute>
 }
 />

 <Route
 path="/how-it-works"
 element={
 <PageTransition routeKey="how-it-works">
 <HowItWorksPage />
 </PageTransition>
 }
 />

 <Route
 path="/pricing"
 element={
 <PageTransition routeKey="pricing">
 <PricingPage />
 </PageTransition>
 }
 />

 {/* Catch-all: any unknown path bounces back to landing. */}
 <Route path="*" element={<Navigate to="/" replace />} />
 </Routes>
 </AnimatePresence>
 );
}

/**
 * App — application root.
 *
 * Layering (outermost → innermost):
 * <BrowserRouter> // history + location for the whole app
 * <AuthProvider> // session state available to ProtectedRoute & pages
 * <CustomCursor /> // mounted ONCE so it persists across all routes
 * // Ensure the custom cursor stays active on authentication pages
 * <AnimatedRoutes /> // <AnimatePresence> + <Routes>
 *
 * Routes:
 * / → LandingPage (existing marketing site)
 * /login → LoginPage (wrapped in PageTransition)
 * /register → RegisterPage (wrapped in PageTransition)
 * /dashboard/client → ClientDashboardPage (ProtectedRoute + PageTransition + DashboardErrorBoundary)
 * /dashboard/client/create-project → CreateProjectComingSoon (ProtectedRoute + PageTransition)
 * /dashboard/pilot → PilotDashboard (gated by ProtectedRoute)
 * * → Navigate to "/"
 */
 function App() {
 return (
 <BrowserRouter>
 <AuthProvider>
 <CustomCursor />
 <ScrollToHash />
 <AnimatedRoutes />
 </AuthProvider>
 </BrowserRouter>
 );
}

export default App;
