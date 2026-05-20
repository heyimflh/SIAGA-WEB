/**
 * ProjectDetailPage — Premium Project Intelligence Briefing
 *
 * Route: /project/:projectId
 * Accessible by: client, pilot
 *
 * Feature: project-detail-page
 */
import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import projectDetailData from './project-detail-data.js';
import {
  getProjectById,
  getProjectStatus,
  getRoleVisibility,
  getHeroCTA,
  getRelatedProjects,
  validateBidForm,
  getDashboardPath,
} from './project-logic.js';
import Breadcrumb from './components/Breadcrumb/Breadcrumb.jsx';
import ProjectHero from './components/ProjectHero/ProjectHero.jsx';
import ProjectImage from './components/ProjectImage/ProjectImage.jsx';
import BriefingSummaryCards from './components/BriefingSummaryCards/BriefingSummaryCards.jsx';
import StickySectionNavigator from './components/StickySectionNavigator/StickySectionNavigator.jsx';
import ProjectScope from './components/ProjectScope/ProjectScope.jsx';
import { MapLoadingFallback } from './components/InspectionAreaMap/MapLoadingFallback.jsx';
import ProjectTimeline from './components/ProjectTimeline/ProjectTimeline.jsx';
import BiddingSection from './components/BiddingSection/BiddingSection.jsx';
import TechnicalSpecs from './components/TechnicalSpecs/TechnicalSpecs.jsx';
import ClientInfoSection from './components/ClientInfoSection/ClientInfoSection.jsx';
import RelatedProjects from './components/RelatedProjects/RelatedProjects.jsx';
import StickyBottomCTA from './components/StickyBottomCTA/StickyBottomCTA.jsx';
import NotFoundState from './components/NotFoundState/NotFoundState.jsx';
import ToastNotification from './components/ToastNotification/ToastNotification.jsx';
import SectionReveal from './components/SectionReveal.jsx';
import './ProjectDetailPage.css';

const InspectionAreaMap = lazy(() => import('./components/InspectionAreaMap/InspectionAreaMap.jsx'));

const BID_STORAGE_PREFIX = 'siaga_bid_';

function getBidFromStorage(projectId) {
  try {
    const raw = sessionStorage.getItem(`${BID_STORAGE_PREFIX}${projectId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveBidToStorage(projectId, bidData) {
  try {
    sessionStorage.setItem(`${BID_STORAGE_PREFIX}${projectId}`, JSON.stringify(bidData));
  } catch { /* ignore */ }
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const role = session?.role || 'pilot';

  // Core state
  const project = useMemo(() => getProjectById(projectDetailData, projectId), [projectId]);
  const derivedStatus = useMemo(() => getProjectStatus(project), [project]);
  const [hasBid, setHasBid] = useState(false);
  const [submittedBid, setSubmittedBid] = useState(null);

  // Bid form state
  const [bidFormData, setBidFormData] = useState({ harga: '', estimasiHari: '', droneType: '', catatan: '' });
  const [bidFormErrors, setBidFormErrors] = useState({});
  const [isBidSubmitting, setIsBidSubmitting] = useState(false);

  // Modal/Drawer state
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedPilotId, setSelectedPilotId] = useState(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [drawerPilotId, setDrawerPilotId] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Active section for sticky nav
  const [activeSectionId, setActiveSectionId] = useState('overview');

  // Load bid from sessionStorage on mount / projectId change
  useEffect(() => {
    const stored = getBidFromStorage(projectId);
    if (stored) {
      setHasBid(true);
      setSubmittedBid(stored);
    } else {
      setHasBid(false);
      setSubmittedBid(null);
    }
    setBidFormData({ harga: '', estimasiHari: '', droneType: '', catatan: '' });
    setBidFormErrors({});
    setIsBidSubmitting(false);
  }, [projectId]);

  // Derived values
  const roleVisibility = useMemo(
    () => getRoleVisibility(role, derivedStatus, hasBid),
    [role, derivedStatus, hasBid]
  );
  const heroCTA = useMemo(() => getHeroCTA(role, derivedStatus, hasBid), [role, derivedStatus, hasBid]);
  const relatedProjects = useMemo(
    () => (project ? getRelatedProjects(project, projectDetailData) : []),
    [project]
  );

  // Handlers
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleHeroCTA = useCallback(() => {
    if (heroCTA.action === 'scroll-bidding') {
      document.getElementById('bidding')?.scrollIntoView({ behavior: 'smooth' });
    } else if (heroCTA.action === 'report') {
      navigate(`/dashboard/client/report-generator?projectId=${projectId}`);
    }
  }, [heroCTA, navigate, projectId]);

  const handleBidFormChange = useCallback((field, value) => {
    setBidFormData((prev) => ({ ...prev, [field]: value }));
    setBidFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleBidSubmit = useCallback((e) => {
    e.preventDefault();
    const { valid, errors } = validateBidForm(bidFormData);
    if (!valid) {
      setBidFormErrors(errors);
      return;
    }
    setIsBidSubmitting(true);
    setTimeout(() => {
      const bidData = { ...bidFormData, submittedAt: new Date().toISOString() };
      saveBidToStorage(projectId, bidData);
      setSubmittedBid(bidData);
      setHasBid(true);
      setIsBidSubmitting(false);
      showToast('Penawaran berhasil dikirim!');
    }, 800);
  }, [bidFormData, projectId, showToast]);

  const handleSelectPilot = useCallback((pilotId) => {
    setSelectedPilotId(pilotId);
    setIsSelectionModalOpen(true);
  }, []);

  const handleConfirmSelection = useCallback(() => {
    setIsSelectionModalOpen(false);
    setSelectedPilotId(null);
    showToast('Pilot berhasil dipilih!');
  }, [showToast]);

  const handleViewProfile = useCallback((pilotId) => {
    setDrawerPilotId(pilotId);
    setIsProfileDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsProfileDrawerOpen(false);
    setDrawerPilotId(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsSelectionModalOpen(false);
    setSelectedPilotId(null);
  }, []);

  // Not found
  if (!project) {
    return (
      <main className="project-detail-page">
        <NotFoundState role={role} dashboardPath={getDashboardPath(role)} />
      </main>
    );
  }

  const sections = useMemo(() => {
    const base = [
      { id: 'overview', label: 'Overview' },
      { id: 'area', label: 'Area Inspeksi' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'bidding', label: 'Bidding' },
      { id: 'specs', label: 'Specs' },
    ];
    if (role === 'pilot') {
      base.push({ id: 'client-info', label: 'Client' });
      base.push({ id: 'related', label: 'Related' });
    }
    return base;
  }, [role]);

  return (
    <main className="project-detail-page">
      <div className="project-detail-container">
        <Breadcrumb role={role} projectName={project.nama} />

        <ProjectHero
          project={project}
          derivedStatus={derivedStatus}
          role={role}
          hasBid={hasBid}
          heroCTA={heroCTA}
          onCTAClick={handleHeroCTA}
        />

        <SectionReveal>
          <ProjectImage
            jenisInfrastruktur={project.jenis_infrastruktur}
            projectName={project.nama}
          />
        </SectionReveal>

        <BriefingSummaryCards
          project={project}
          role={role}
          derivedStatus={derivedStatus}
        />

        <StickySectionNavigator
          sections={sections}
          activeSectionId={activeSectionId}
          onSectionChange={setActiveSectionId}
        />

        <section id="overview" className="project-detail-section">
          <SectionReveal>
            <ProjectScope project={project} />
          </SectionReveal>
        </section>

        <section id="area" className="project-detail-section">
          <SectionReveal delay={0.1}>
            <Suspense fallback={<MapLoadingFallback />}>
              <InspectionAreaMap
                polygonCoords={project.polygon_area}
                inspectionPoints={project.titik_inspeksi}
                luasArea={project.luas_area}
                pointCount={project.jumlah_titik_inspeksi}
              />
            </Suspense>
          </SectionReveal>
        </section>

        <section id="timeline" className="project-detail-section">
          <SectionReveal delay={0.1}>
            <ProjectTimeline
              milestones={project.milestones}
              projectStatus={derivedStatus}
            />
          </SectionReveal>
        </section>

        <section id="bidding" className="project-detail-section">
          <SectionReveal delay={0.1}>
            <BiddingSection
              role={role}
              project={project}
              derivedStatus={derivedStatus}
              roleVisibility={roleVisibility}
              hasBid={hasBid}
              submittedBid={submittedBid}
              bidFormData={bidFormData}
              bidFormErrors={bidFormErrors}
              isBidSubmitting={isBidSubmitting}
              onBidFormChange={handleBidFormChange}
              onBidSubmit={handleBidSubmit}
              onSelectPilot={handleSelectPilot}
              onViewProfile={handleViewProfile}
              isSelectionModalOpen={isSelectionModalOpen}
              selectedPilotId={selectedPilotId}
              onConfirmSelection={handleConfirmSelection}
              onCloseModal={handleCloseModal}
              isProfileDrawerOpen={isProfileDrawerOpen}
              drawerPilotId={drawerPilotId}
              onCloseDrawer={handleCloseDrawer}
            />
          </SectionReveal>
        </section>

        <section id="specs" className="project-detail-section">
          <SectionReveal delay={0.1}>
            <TechnicalSpecs specs={project.spesifikasi_teknis} />
          </SectionReveal>
        </section>

        {roleVisibility.showClientInfo && (
          <section id="client-info" className="project-detail-section">
            <SectionReveal delay={0.1}>
              <ClientInfoSection clientInfo={project.client_info} />
            </SectionReveal>
          </section>
        )}

        {roleVisibility.showRelatedProjects && relatedProjects.length > 0 && (
          <section id="related" className="project-detail-section">
            <SectionReveal delay={0.1}>
              <RelatedProjects projects={relatedProjects} />
            </SectionReveal>
          </section>
        )}
      </div>

      <StickyBottomCTA
        heroCTA={heroCTA}
        onCTAClick={handleHeroCTA}
      />

      {toastMessage && (
        <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </main>
  );
}
