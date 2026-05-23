import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { mockData } from './mock-data.js';
import { selectCompanyByEmail, selectBidsForProject } from './utils/selectors.js';
import { resolveInitialProjectId } from './utils/projectResolver.js';
import { safeReadLocalStorage, safeWriteLocalStorage } from './utils/storage.js';

import './ClientDashboardPage.css';

import DashboardShell from './shell/DashboardShell.jsx';

import CommandHeader from './sections/CommandHeader/CommandHeader.jsx';
import OverviewCards from './sections/OverviewCards/OverviewCards.jsx';
import ProjectTimeline from './sections/ProjectTimeline/ProjectTimeline.jsx';
import BiddingReviewTable from './sections/BiddingReviewTable/BiddingReviewTable.jsx';
import PilotProfileDrawer from './sections/BiddingReviewTable/PilotProfileDrawer.jsx';
import PilotSelectionModal from './sections/BiddingReviewTable/PilotSelectionModal.jsx';
import RecentActivityFeed from './sections/RecentActivityFeed/RecentActivityFeed.jsx';
import QuickStatsFooter from './sections/QuickStatsFooter/QuickStatsFooter.jsx';

import AssetMapErrorBoundary from './sections/AssetMonitoringMap/AssetMapErrorBoundary.jsx';
import AssetMapFallback from './sections/AssetMonitoringMap/AssetMapFallback.jsx';
import AssetDetailDrawer from './sections/AssetMonitoringMap/AssetDetailDrawer.jsx';

const AssetMonitoringMap = lazy(() => import('./sections/AssetMonitoringMap'));

const LS_KEY_PROJECT = 'siaga.client.lastSelectedProjectId';

function ClientDashboardPage() {
 const { session } = useAuth();

 const company = selectCompanyByEmail(mockData, session?.email);
 const companyName = company.nama || session?.email || 'Client';

 const [selectedProjectId, setSelectedProjectId] = useState(() => {
 const stored = safeReadLocalStorage(LS_KEY_PROJECT);
 return resolveInitialProjectId(mockData, stored);
 });

 useEffect(() => {
 if (selectedProjectId) {
 safeWriteLocalStorage(LS_KEY_PROJECT, selectedProjectId);
 }
 }, [selectedProjectId]);

 const [mapFilter, setMapFilter] = useState('all');

 const [bidFilters, setBidFilters] = useState({
 siagaVerifiedOnly: false,
 ratingMin4: false,
 });

 const [bidSort, setBidSort] = useState(null);

 const [drawer, setDrawer] = useState({ kind: null, payload: null });

 const handleSelectProject = useCallback((id) => {
 setSelectedProjectId(id);
 }, []);

 const handleMapFilterChange = useCallback((filter) => {
 setMapFilter(filter);
 }, []);

 const handlePinClick = useCallback((asset) => {
 setDrawer({ kind: 'asset', payload: asset });
 }, []);

 const handleToggleChip = useCallback((chipName) => {
 setBidFilters((prev) => ({
 ...prev,
 [chipName]: !prev[chipName],
 }));
 }, []);

 const handleSort = useCallback((key) => {
 setBidSort((prev) => {
 if (prev && prev.key === key) {

 if (prev.direction === 'asc') return { key, direction: 'desc' };

 return null;
 }
 return { key, direction: 'asc' };
 });
 }, []);

 const handleResetFilters = useCallback(() => {
 setBidFilters({ siagaVerifiedOnly: false, ratingMin4: false });
 }, []);

 const handleViewProfile = useCallback((bid) => {
 setDrawer({ kind: 'pilot', payload: bid });
 }, []);

 const handleSelectPilot = useCallback((bid) => {
 setDrawer({ kind: 'pilot-confirm', payload: bid });
 }, []);

 const handleCloseDrawer = useCallback(() => {
 setDrawer({ kind: null, payload: null });
 }, []);

 const handleConfirmPilot = useCallback(() => {

 setDrawer({ kind: null, payload: null });
 }, []);

 const bidsForProject = selectBidsForProject(mockData, selectedProjectId);

 return (
 <div className="dashboard-shell">
 <DashboardShell
 session={session}
 mockData={mockData}
 companyName={companyName}
 notifUnread={mockData.notifications.unread_count}
 >
 <CommandHeader
 companyName={companyName}
 projects={mockData.proyek_aktif}
 selectedProjectId={selectedProjectId}
 onSelectProject={handleSelectProject}
 />

 <OverviewCards metrics={mockData.overview_metrics} />

 <div className="dashboard-main-content">
 <div className="dashboard-main-content__primary">
 <div className="dashboard-section">
 <h2 className="dashboard-section__title">Monitoring Aset</h2>
 <AssetMapErrorBoundary assets={mockData.assets}>
 <Suspense fallback={<AssetMapFallback variant="loading" />}>
 <AssetMonitoringMap
 assets={mockData.assets}
 mapFilter={mapFilter}
 onFilterChange={handleMapFilterChange}
 onPinClick={handlePinClick}
 mockData={mockData}
 />
 </Suspense>
 </AssetMapErrorBoundary>
 </div>
 </div>

 <div className="dashboard-main-content__aside">
 <RecentActivityFeed activities={mockData.activities} />
 </div>
 </div>

 <div className="dashboard-section">
 <h2 className="dashboard-section__title">Timeline Proyek</h2>
 <ProjectTimeline
 projects={mockData.proyek_aktif}
 selectedProjectId={selectedProjectId}
 onSelectProject={handleSelectProject}
 />
 </div>


 <div className="dashboard-section">
 <h2 className="dashboard-section__title">Review Penawaran</h2>
 <BiddingReviewTable
 bids={bidsForProject}
 bidFilters={bidFilters}
 bidSort={bidSort}
 onToggleChip={handleToggleChip}
 onSort={handleSort}
 onResetFilters={handleResetFilters}
 onViewProfile={handleViewProfile}
 onSelectPilot={handleSelectPilot}
 />
 </div>


 <QuickStatsFooter quickStats={mockData.quick_stats} />
 </DashboardShell>


 <AssetDetailDrawer
 asset={drawer.kind === 'asset' ? drawer.payload : null}
 isOpen={drawer.kind === 'asset'}
 onClose={handleCloseDrawer}
 />

 <PilotProfileDrawer
 pilot={drawer.kind === 'pilot' ? drawer.payload : null}
 isOpen={drawer.kind === 'pilot'}
 onClose={handleCloseDrawer}
 />

 <PilotSelectionModal
 pilot={drawer.kind === 'pilot-confirm' ? drawer.payload : null}
 isOpen={drawer.kind === 'pilot-confirm'}
 onClose={handleCloseDrawer}
 onConfirm={handleConfirmPilot}
 />
 </div>
 );
}

export default ClientDashboardPage;
