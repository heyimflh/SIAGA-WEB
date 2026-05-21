/**
 * PilotDashboardShell — Responsive grid layout (sidebar + topbar + main).
 *
 * Mirrors Client Dashboard shell pattern for consistency.
 * Feature: pilot-dashboard
 * Validates: Requirements 2, 3, 4, 16
 */

import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import PilotSidebar from './PilotSidebar';
import PilotTopbar from './PilotTopbar';
import './PilotDashboardShell.css';

function PilotDashboardShell({ pilotProfile, notifUnread, activeMissionCount, children }) {
 const isDesktop = useMediaQuery('(min-width: 1280px)');
 const isTablet = useMediaQuery('(min-width: 768px)');
 const isMobile = !isTablet;

 const [drawerOpen, setDrawerOpen] = useState(false);

 let sidebarVariant = 'full';
 if (isMobile) sidebarVariant = 'drawer';
 else if (!isDesktop) sidebarVariant = 'icon';

 const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
 const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

 // Close drawer on Escape
 useEffect(() => {
 if (!drawerOpen) return;
 const handleKey = (e) => {
 if (e.key === 'Escape') {
 setDrawerOpen(false);
 }
 };
 document.addEventListener('keydown', handleKey);
 return () => document.removeEventListener('keydown', handleKey);
 }, [drawerOpen]);

 const layoutClass = [
 'pilot-shell',
 'pilot-shell__layout',
 isDesktop ? 'pilot-shell__layout--desktop' : '',
 !isDesktop && isTablet ? 'pilot-shell__layout--tablet' : '',
 isMobile ? 'pilot-shell__layout--mobile' : '',
 ].filter(Boolean).join(' ');

 return (
 <div className={layoutClass}>
 {/* Sidebar */}
 {isMobile ? (
 <>
 {drawerOpen && (
 <div
 className="pilot-shell__drawer-backdrop"
 onClick={handleDrawerClose}
 aria-hidden="true"
 />
 )}
 <aside
 className={`pilot-shell__sidebar pilot-shell__sidebar--drawer ${drawerOpen ? 'pilot-shell__sidebar--open' : ''}`}
 aria-label="Navigasi pilot"
 >
 <PilotSidebar
 pilotName={pilotProfile.nama}
 avatarUrl={pilotProfile.avatar}
 isVerified={pilotProfile.is_verified}
 variant="drawer"
 drawerOpen={drawerOpen}
 onDrawerClose={handleDrawerClose}
 />
 </aside>
 </>
 ) : (
 <aside
 className={`pilot-shell__sidebar pilot-shell__sidebar--${sidebarVariant}`}
 aria-label="Navigasi pilot"
 >
 <PilotSidebar
 pilotName={pilotProfile.nama}
 avatarUrl={pilotProfile.avatar}
 isVerified={pilotProfile.is_verified}
 variant={sidebarVariant}
 />
 </aside>
 )}

 {/* Topbar */}
 <header className="pilot-shell__topbar">
 <PilotTopbar
 pilotName={pilotProfile.nama}
 unreadCount={notifUnread}
 activeMissionCount={activeMissionCount}
 onHamburgerClick={handleDrawerOpen}
 showHamburger={isMobile}
 />
 </header>

 {/* Main Content */}
 <main className="pilot-shell__main">
 {children}
 </main>
 </div>
 );
}

export default PilotDashboardShell;
