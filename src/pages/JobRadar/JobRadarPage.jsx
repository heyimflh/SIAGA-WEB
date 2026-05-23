import { useState, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { ChevronLeft } from 'lucide-react';
import projects from './mock-data.js';
import {
 applyFilters,
 sortProjects,
 computeStats,
 resetFilters,
 getActiveFilterCount,
} from './filters.js';
import RadarSidebar from './components/RadarSidebar/RadarSidebar.jsx';
import RadarHUD from './components/RadarHUD/RadarHUD.jsx';
import ProjectDetailDrawer from './components/ProjectDetailDrawer/ProjectDetailDrawer.jsx';
import MobileBottomSheet from './components/MobileBottomSheet/MobileBottomSheet.jsx';
import ToastNotification from './components/ToastNotification/ToastNotification.jsx';
import MapLoadingFallback from './components/RadarMap/MapLoadingFallback.jsx';
import MapErrorBoundary from './components/RadarMap/MapErrorBoundary.jsx';
import './JobRadarPage.css';
import './JobRadarDarkOverride.css';

const RadarMap = lazy(() => import('./components/RadarMap/index.js'));

export default function JobRadarPage() {

 const [filters, setFilters] = useState(resetFilters);
 const [sortBy, setSortBy] = useState('terbaru');

 const [sidebarOpen, setSidebarOpen] = useState(true);
 const [bottomSheetState, setBottomSheetState] = useState('collapsed');

 const [selectedPinId, setSelectedPinId] = useState(null);
 const [hoveredCardId, setHoveredCardId] = useState(null);
 const [highlightedCardId, setHighlightedCardId] = useState(null);
 const [popupProject, setPopupProject] = useState(null);
 const [detailProject, setDetailProject] = useState(null);
 const [toastMessage, setToastMessage] = useState(null);
 const [flyToTarget, setFlyToTarget] = useState(null);
 const [, setMapReady] = useState(false);

 const ariaLiveRef = useRef(null);
 const highlightTimeoutRef = useRef(null);

 const filteredProjects = useMemo(
 () => applyFilters(projects, filters),
 [filters]
 );

 const sortedProjects = useMemo(
 () => sortProjects(filteredProjects, sortBy),
 [filteredProjects, sortBy]
 );

 const visibleStats = useMemo(
 () => computeStats(filteredProjects),
 [filteredProjects]
 );

 const activeFilterCount = useMemo(
 () => getActiveFilterCount(filters),
 [filters]
 );

 const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
 const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1280;

 const handleSidebarToggle = useCallback(() => {
 setSidebarOpen(prev => !prev);
 }, []);

 const handleCardHover = useCallback((projectId) => {
 setHoveredCardId(projectId);
 }, []);

 const handleCardClick = useCallback((project) => {
 setSelectedPinId(project.id);
 setFlyToTarget({ lat: project.lokasi.lat, lng: project.lokasi.lng });
 setPopupProject(project);
 }, []);

 const handlePinClick = useCallback((project) => {
 setSelectedPinId(project.id);
 setPopupProject(project);

 setHighlightedCardId(project.id);
 if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
 highlightTimeoutRef.current = setTimeout(() => {
 setHighlightedCardId(null);
 }, 3000);
 }, []);

 const handlePinHover = useCallback((projectId) => {
 setHoveredCardId(projectId);
 }, []);

 const handleMapReady = useCallback(() => {
 setMapReady(true);
 }, []);

 const handleFlyToComplete = useCallback(() => {
 setFlyToTarget(null);
 if (ariaLiveRef.current) {
 ariaLiveRef.current.textContent = 'Peta telah berpindah ke lokasi proyek.';
 }
 }, []);

 const handlePopupClose = useCallback(() => {
 setPopupProject(null);
 setSelectedPinId(null);
 }, []);

 const handleOpenDetail = useCallback((project) => {
 setDetailProject(project);
 setPopupProject(null);
 }, []);

 const handleCloseDetail = useCallback(() => {
 setDetailProject(null);
 }, []);

 const handleBidClick = useCallback(() => {
 setToastMessage('Fitur bidding akan tersedia di versi berikutnya.');
 }, []);

 const handleResetFilters = useCallback(() => {
 setFilters(resetFilters());
 setToastMessage('Filter berhasil direset.');
 }, []);

 const handleToastDismiss = useCallback(() => {
 setToastMessage(null);
 }, []);

 const showDesktopSidebar = !isMobile;
 const sidebarIsOverlay = isTablet;

 const pageClasses = [
 'job-radar-page',
 'job-radar-dark',
 'job-radar-protected',
 'pilot-job-radar-page',
 !sidebarOpen && !isTablet && !isMobile && 'job-radar-page--sidebar-collapsed',
 ].filter(Boolean).join(' ');

 return (
 <div className={pageClasses}>
 {showDesktopSidebar && (
 <RadarSidebar
 isOpen={sidebarOpen}
 isOverlay={sidebarIsOverlay}
 onToggle={handleSidebarToggle}
 filters={filters}
 onFiltersChange={setFilters}
 sortBy={sortBy}
 onSortChange={setSortBy}
 projects={sortedProjects}
 stats={visibleStats}
 hoveredCardId={hoveredCardId}
 highlightedCardId={highlightedCardId}
 onCardHover={handleCardHover}
 onCardClick={handleCardClick}
 onDetailClick={handleOpenDetail}
 onBidClick={handleBidClick}
 onResetFilters={handleResetFilters}
 />
 )}

 <div className="job-radar-page__map-area">
 {showDesktopSidebar && !sidebarOpen && (
 <button
 className={`job-radar-page__sidebar-toggle ${!sidebarOpen ? 'job-radar-page__sidebar-toggle--collapsed' : ''}`}
 onClick={handleSidebarToggle}
 aria-expanded={sidebarOpen}
 aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
 >
 <ChevronLeft size={16} />
 </button>
 )}


 <RadarHUD
 stats={visibleStats}
 activeFilterCount={activeFilterCount}
 isCompact={isMobile}
 />

 <MapErrorBoundary>
 <Suspense fallback={<MapLoadingFallback />}>
 <RadarMap
 projects={filteredProjects}
 selectedPinId={selectedPinId}
 hoveredPinId={hoveredCardId}
 flyToTarget={flyToTarget}
 popupProject={popupProject}
 onPinClick={handlePinClick}
 onPinHover={handlePinHover}
 onMapReady={handleMapReady}
 onFlyToComplete={handleFlyToComplete}
 onPopupClose={handlePopupClose}
 onBidClick={handleBidClick}
 onDetailClick={handleOpenDetail}
 />
 </Suspense>
 </MapErrorBoundary>

 <ProjectDetailDrawer
 project={detailProject}
 isOpen={!!detailProject}
 onClose={handleCloseDetail}
 onBidClick={handleBidClick}
 isMobile={isMobile}
 />
 </div>


 {isMobile && (
 <MobileBottomSheet
 state={bottomSheetState}
 onStateChange={setBottomSheetState}
 filters={filters}
 onFiltersChange={setFilters}
 sortBy={sortBy}
 onSortChange={setSortBy}
 projects={sortedProjects}
 stats={visibleStats}
 hoveredCardId={hoveredCardId}
 highlightedCardId={highlightedCardId}
 onCardHover={handleCardHover}
 onCardClick={handleCardClick}
 onDetailClick={handleOpenDetail}
 onBidClick={handleBidClick}
 onResetFilters={handleResetFilters}
 />
 )}

 <ToastNotification
 message={toastMessage}
 onDismiss={handleToastDismiss}
 />

 <div
 ref={ariaLiveRef}
 className="job-radar-page__aria-live"
 aria-live="polite"
 aria-atomic="true"
 />
 </div>
 );
}
