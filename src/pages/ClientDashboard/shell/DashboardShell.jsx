/**
 * DashboardShell — responsive grid layout (sidebar + topbar + main).
 *
 * Breakpoints:
 *   ≥1280px  → full sidebar (240-280px) + topbar + main (2-col grid)
 *   768-1279 → icon-only sidebar (64px) + topbar + main
 *   <768px   → single column, sidebar as drawer overlay
 *
 * Requirements: 2.1, 3.6, 3.7, 3.8, 12.1, 12.2, 12.3, 12.6, 13.2
 * Spec: .kiro/specs/client-dashboard
 */

import { useState } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './DashboardShell.css';

function DashboardShell({ session, mockData, companyName, notifUnread, children }) {
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isMobile = !isTablet;

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Determine sidebar variant
  let sidebarVariant = 'full';
  if (isMobile) {
    sidebarVariant = 'drawer';
  } else if (!isDesktop) {
    sidebarVariant = 'icon';
  }

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  // Layout class based on breakpoint
  const layoutClass = [
    'dashboard-shell',
    'dashboard-shell__layout',
    isDesktop ? 'dashboard-shell__layout--desktop' : '',
    !isDesktop && isTablet ? 'dashboard-shell__layout--tablet' : '',
    isMobile ? 'dashboard-shell__layout--mobile' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClass}>
      {/* Sidebar */}
      {isMobile ? (
        <>
          {/* Drawer overlay for mobile */}
          {drawerOpen && (
            <div
              className="dashboard-shell__drawer-backdrop"
              onClick={handleDrawerClose}
              aria-hidden="true"
            />
          )}
          <aside
            className={`dashboard-shell__sidebar dashboard-shell__sidebar--drawer ${drawerOpen ? 'dashboard-shell__sidebar--open' : ''}`}
            aria-label="Navigasi utama"
          >
            <Sidebar
              companyName={companyName}
              variant="drawer"
              drawerOpen={drawerOpen}
              onDrawerClose={handleDrawerClose}
            />
          </aside>
        </>
      ) : (
        <aside
          className={`dashboard-shell__sidebar dashboard-shell__sidebar--${sidebarVariant}`}
          aria-label="Navigasi utama"
        >
          <Sidebar
            companyName={companyName}
            variant={sidebarVariant}
          />
        </aside>
      )}

      {/* Topbar */}
      <header className="dashboard-shell__topbar">
        {isMobile && (
          <button
            className="dashboard-shell__hamburger"
            onClick={handleDrawerOpen}
            aria-label="Buka navigasi"
            type="button"
          >
            <span className="dashboard-shell__hamburger-icon" />
          </button>
        )}
        <Topbar
          companyName={companyName}
          unreadCount={notifUnread ?? mockData?.notifications?.unread_count ?? 0}
          onSidebarToggle={handleDrawerOpen}
          showHamburger={false}
        />
      </header>

      {/* Main Content Area */}
      <main className="dashboard-shell__main">
        {children}
      </main>
    </div>
  );
}

export default DashboardShell;
