/**
 * ClientDashboardPage — entry untuk route `/dashboard/client`.
 *
 * Compose shell + 7 section. Mengelola state:
 *   - selectedProjectId (persisted ke localStorage)
 *   - mapFilter (per-session in-memory)
 *   - bidFilters (per-session in-memory)
 *   - bidSort (per-session in-memory)
 *   - drawer (single-drawer state machine)
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 1.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 10.2, 12.6
 */

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { mockData } from './mock-data.js';
import { selectCompanyByEmail, selectBidsForProject } from './utils/selectors.js';
import { resolveInitialProjectId } from './utils/projectResolver.js';
import { safeReadLocalStorage, safeWriteLocalStorage } from './utils/storage.js';

import './ClientDashboardPage.css';

// Shell
import DashboardShell from './shell/DashboardShell.jsx';

// Sections (eagerly loaded — lightweight)
import CommandHeader from './sections/CommandHeader/CommandHeader.jsx';
import OverviewCards from './sections/OverviewCards/OverviewCards.jsx';
import ProjectTimeline from './sections/ProjectTimeline/ProjectTimeline.jsx';
import BiddingReviewTable from './sections/BiddingReviewTable/BiddingReviewTable.jsx';
import PilotProfileDrawer from './sections/BiddingReviewTable/PilotProfileDrawer.jsx';
import PilotSelectionModal from './sections/BiddingReviewTable/PilotSelectionModal.jsx';
import RecentActivityFeed from './sections/RecentActivityFeed/RecentActivityFeed.jsx';
import QuickStatsFooter from './sections/QuickStatsFooter/QuickStatsFooter.jsx';

// Asset Map — lazy loaded (Mapbox GL JS ~700KB) (Requirements 5.16, 11.1)
import AssetMapErrorBoundary from './sections/AssetMonitoringMap/AssetMapErrorBoundary.jsx';
import AssetMapFallback from './sections/AssetMonitoringMap/AssetMapFallback.jsx';
import AssetDetailDrawer from './sections/AssetMonitoringMap/AssetDetailDrawer.jsx';

const AssetMonitoringMap = lazy(() => import('./sections/AssetMonitoringMap'));

/** localStorage key for persisted project selection */
const LS_KEY_PROJECT = 'siaga.client.lastSelectedProjectId';

function ClientDashboardPage() {
  const { session } = useAuth();

  // Resolve session → companyName via selector with fallback to session.email
  const company = selectCompanyByEmail(mockData, session?.email);
  const companyName = company.nama || session?.email || 'Client';

  // ─── State: selectedProjectId (persisted cross-session) ───────────────
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    const stored = safeReadLocalStorage(LS_KEY_PROJECT);
    return resolveInitialProjectId(mockData, stored);
  });

  // Write-back to localStorage on every change (Requirement 6.4a)
  useEffect(() => {
    if (selectedProjectId) {
      safeWriteLocalStorage(LS_KEY_PROJECT, selectedProjectId);
    }
  }, [selectedProjectId]);

  // ─── State: mapFilter (per-session in-memory, Requirement 5.11) ───────
  const [mapFilter, setMapFilter] = useState('all');

  // ─── State: bidFilters (per-session in-memory) ────────────────────────
  const [bidFilters, setBidFilters] = useState({
    siagaVerifiedOnly: false,
    ratingMin4: false,
  });

  // ─── State: bidSort ───────────────────────────────────────────────────
  const [bidSort, setBidSort] = useState(null);

  // ─── State: drawer (single-drawer state machine) ──────────────────────
  // Only one drawer/modal active at a time.
  // kind: 'asset' | 'pilot' | 'pilot-confirm' | null
  const [drawer, setDrawer] = useState({ kind: null, payload: null });

  // ─── Handlers ─────────────────────────────────────────────────────────

  // Project selection
  const handleSelectProject = useCallback((id) => {
    setSelectedProjectId(id);
  }, []);

  // Map filter
  const handleMapFilterChange = useCallback((filter) => {
    setMapFilter(filter);
  }, []);

  // Map pin click → open asset drawer
  const handlePinClick = useCallback((asset) => {
    setDrawer({ kind: 'asset', payload: asset });
  }, []);

  // Bid filter chip toggle
  const handleToggleChip = useCallback((chipName) => {
    setBidFilters((prev) => ({
      ...prev,
      [chipName]: !prev[chipName],
    }));
  }, []);

  // Bid sort
  const handleSort = useCallback((key) => {
    setBidSort((prev) => {
      if (prev && prev.key === key) {
        // Toggle direction
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        // If already desc, remove sort
        return null;
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // Reset bid filters
  const handleResetFilters = useCallback(() => {
    setBidFilters({ siagaVerifiedOnly: false, ratingMin4: false });
  }, []);

  // View pilot profile → open pilot drawer
  const handleViewProfile = useCallback((bid) => {
    setDrawer({ kind: 'pilot', payload: bid });
  }, []);

  // Select pilot → open confirmation modal
  const handleSelectPilot = useCallback((bid) => {
    setDrawer({ kind: 'pilot-confirm', payload: bid });
  }, []);

  // Close any drawer/modal
  const handleCloseDrawer = useCallback(() => {
    setDrawer({ kind: null, payload: null });
  }, []);

  // Confirm pilot selection (mock — just close modal)
  const handleConfirmPilot = useCallback(() => {
    // In a real app, this would trigger an API call.
    // For demo, just close the modal.
    setDrawer({ kind: null, payload: null });
  }, []);

  // ─── Derived data ─────────────────────────────────────────────────────
  const bidsForProject = selectBidsForProject(mockData, selectedProjectId);

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="dashboard-shell">
      <DashboardShell
        session={session}
        mockData={mockData}
        companyName={companyName}
        notifUnread={mockData.notifications.unread_count}
      >
        {/* Command Header — Premium greeting + project tabs */}
        <CommandHeader
          companyName={companyName}
          projects={mockData.proyek_aktif}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
        />

        {/* Section A: Overview Cards */}
        <OverviewCards metrics={mockData.overview_metrics} />

        {/* Main Content Area — map + activity side-by-side on desktop */}
        <div className="dashboard-main-content">
          {/* Primary column (left ~65%) */}
          <div className="dashboard-main-content__primary">
            {/* Section B: Asset Monitoring Map (lazy + Suspense + ErrorBoundary) */}
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

          {/* Secondary column (right ~35%) — sticky on desktop */}
          <div className="dashboard-main-content__aside">
            {/* Section E: Recent Activity Feed */}
            <RecentActivityFeed activities={mockData.activities} />
          </div>
        </div>

        {/* Section C: Project Timeline */}
        <div className="dashboard-section">
          <h2 className="dashboard-section__title">Timeline Proyek</h2>
          <ProjectTimeline
            projects={mockData.proyek_aktif}
            selectedProjectId={selectedProjectId}
            onSelectProject={handleSelectProject}
          />
        </div>

        {/* Section D: Bidding Review Table */}
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

        {/* Section F: Quick Stats Footer (full width, below grid) */}
        <QuickStatsFooter quickStats={mockData.quick_stats} />
      </DashboardShell>

      {/* ─── Drawers & Modals (single-drawer state machine) ─────────── */}

      {/* Asset Detail Drawer */}
      <AssetDetailDrawer
        asset={drawer.kind === 'asset' ? drawer.payload : null}
        isOpen={drawer.kind === 'asset'}
        onClose={handleCloseDrawer}
      />

      {/* Pilot Profile Drawer */}
      <PilotProfileDrawer
        pilot={drawer.kind === 'pilot' ? drawer.payload : null}
        isOpen={drawer.kind === 'pilot'}
        onClose={handleCloseDrawer}
      />

      {/* Pilot Selection Modal */}
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
