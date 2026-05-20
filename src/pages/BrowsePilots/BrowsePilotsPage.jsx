import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { pilots } from './mock-data.js';
import {
  applySearchAndFilters,
  getAutocompleteSuggestions,
  getActiveFilterCount,
  getResultSummary,
} from './filters.js';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClosingSection from '../../components/ClosingSection';
import HeroSection from './components/HeroSection/HeroSection.jsx';
import FilterBar from './components/FilterBar/FilterBar.jsx';
import ActiveFilterChips from './components/ActiveFilterChips/ActiveFilterChips.jsx';
import MobileFilterSheet from './components/MobileFilterSheet/MobileFilterSheet.jsx';
import PilotGrid from './components/PilotGrid/PilotGrid.jsx';
import PilotProfileDrawer from './components/PilotProfileDrawer/PilotProfileDrawer.jsx';
import PortfolioLightbox from './components/PortfolioLightbox/PortfolioLightbox.jsx';
import CTAJoinSection from './components/CTAJoinSection/CTAJoinSection.jsx';
import ToastNotification from './components/ToastNotification/ToastNotification.jsx';
import './BrowsePilotsPage.css';

const INITIAL_VISIBLE_DESKTOP = 6;
const INITIAL_VISIBLE_MOBILE = 4;
const LOAD_MORE_COUNT = 3;

const DEFAULT_FILTERS = {
  specializations: [],
  province: null,
  minRating: null,
  verifiedOnly: false,
};

export default function BrowsePilotsPage() {
  const { session } = useAuth();
  const authRole = session?.role || null;

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  // Filter state
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
      ? INITIAL_VISIBLE_MOBILE
      : INITIAL_VISIBLE_DESKTOP
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Drawer / Lightbox state
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState({
    open: false,
    images: [],
    currentIndex: 0,
  });

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);

  // Refs
  const viewProfileTriggerRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset visible count when filters/search change
  useEffect(() => {
    setVisibleCount(
      typeof window !== 'undefined' && window.innerWidth < 768
        ? INITIAL_VISIBLE_MOBILE
        : INITIAL_VISIBLE_DESKTOP
    );
  }, [debouncedQuery, filters]);

  // Computed data
  const filteredPilots = useMemo(
    () => applySearchAndFilters(pilots, debouncedQuery, filters),
    [debouncedQuery, filters]
  );

  const visiblePilots = useMemo(
    () => filteredPilots.slice(0, visibleCount),
    [filteredPilots, visibleCount]
  );

  const suggestions = useMemo(
    () => getAutocompleteSuggestions(pilots, searchQuery),
    [searchQuery]
  );

  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters, debouncedQuery),
    [filters, debouncedQuery]
  );

  const resultSummary = useMemo(
    () => getResultSummary(filteredPilots.length, visiblePilots.length),
    [filteredPilots.length, visiblePilots.length]
  );

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setSuggestionIndex(-1);
  }, []);

  const handleSuggestionSelect = useCallback((suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    setSuggestionIndex(-1);
  }, []);

  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && suggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[suggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, [suggestions, suggestionIndex, handleSuggestionSelect]);

  const handleSearchFocus = useCallback(() => {
    if (searchQuery.trim().length >= 2) setShowSuggestions(true);
  }, [searchQuery]);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const handleRemoveFilter = useCallback((type, value) => {
    if (type === 'search') {
      setSearchQuery('');
      setDebouncedQuery('');
    } else if (type === 'specialization') {
      setFilters((prev) => ({
        ...prev,
        specializations: prev.specializations.filter((s) => s !== value),
      }));
    } else if (type === 'province') {
      setFilters((prev) => ({ ...prev, province: null }));
    } else if (type === 'rating') {
      setFilters((prev) => ({ ...prev, minRating: null }));
    } else if (type === 'verified') {
      setFilters((prev) => ({ ...prev, verifiedOnly: false }));
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
      setIsLoadingMore(false);
    }, 400);
  }, [isLoadingMore]);

  const handleViewProfile = useCallback((pilot, triggerEl) => {
    setSelectedPilot(pilot);
    setDrawerOpen(true);
    viewProfileTriggerRef.current = triggerEl;
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedPilot(null);
    if (viewProfileTriggerRef.current) {
      viewProfileTriggerRef.current.focus();
      viewProfileTriggerRef.current = null;
    }
  }, []);

  const handleInvite = useCallback((pilot) => {
    if (authRole === 'client') {
      setToastMessage('Fitur invite akan tersedia di versi berikutnya.');
    }
  }, [authRole]);

  const handleHire = useCallback(() => {
    if (authRole === 'client') {
      setToastMessage('Fitur invite akan tersedia di versi berikutnya.');
    }
  }, [authRole]);

  const handleGalleryClick = useCallback((images, index) => {
    setLightboxState({ open: true, images, currentIndex: index });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleLightboxNavigate = useCallback((newIndex) => {
    setLightboxState((prev) => ({ ...prev, currentIndex: newIndex }));
  }, []);

  const handleDismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Show suggestions when typing
  useEffect(() => {
    if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, suggestions.length]);

  return (
    <>
      <Navbar />
      <div className="browse-pilots-page">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        suggestionIndex={suggestionIndex}
        onSuggestionSelect={handleSuggestionSelect}
        onKeyDown={handleSearchKeyDown}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
      />

      <div className="browse-pilots-page__marketplace">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredPilots.length}
          visibleCount={visiblePilots.length}
          onReset={handleResetFilters}
          onOpenMobileFilter={() => setMobileFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        <ActiveFilterChips
          query={debouncedQuery}
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleResetFilters}
        />

        <PilotGrid
          pilots={visiblePilots}
          totalCount={filteredPilots.length}
          visibleCount={visibleCount}
          searchQuery={debouncedQuery}
          authRole={authRole}
          onViewProfile={handleViewProfile}
          onInvite={handleInvite}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
          onReset={handleResetFilters}
          resultSummary={resultSummary}
        />
      </div>

      <CTAJoinSection />

      <ClosingSection>
        <Footer />
      </ClosingSection>

      <PilotProfileDrawer
        pilot={selectedPilot}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        onHire={handleHire}
        onGalleryClick={handleGalleryClick}
        authRole={authRole}
      />

      <PortfolioLightbox
        isOpen={lightboxState.open}
        images={lightboxState.images}
        currentIndex={lightboxState.currentIndex}
        onClose={handleCloseLightbox}
        onNavigate={handleLightboxNavigate}
      />

      <MobileFilterSheet
        isOpen={mobileFilterOpen}
        filters={filters}
        onChange={setFilters}
        onApply={() => setMobileFilterOpen(false)}
        onReset={handleResetFilters}
        onClose={() => setMobileFilterOpen(false)}
      />

      <ToastNotification
        message={toastMessage}
        onDismiss={handleDismissToast}
      />

      {/* Aria live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {resultSummary.total}. {resultSummary.visible}
      </div>
    </div>
    </>
  );
}
