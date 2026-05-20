import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClosingSection from '../../components/ClosingSection';
import CinematicHeroHIW from './sections/CinematicHeroHIW';
import WorkflowNavigator from './sections/WorkflowNavigator';
import MissionJourneyTimeline from './sections/MissionJourneyTimeline';
import BehindWorkflowLayer from './sections/BehindWorkflowLayer';
import DemoTheater from './sections/DemoTheater';
import SampleReportPreview from './sections/SampleReportPreview';
import RoleBasedBenefits from './sections/RoleBasedBenefits';
import CTASectionHIW from './sections/CTASectionHIW';
import './HowItWorksPage.css';

/**
 * HowItWorksPage — SIAGA Mission Control Journey
 * Route: /how-it-works
 * Public page, no ProtectedRoute, no API calls, fully static.
 */
export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="how-it-works-page">
        <CinematicHeroHIW />
        <WorkflowNavigator />
        <MissionJourneyTimeline />
        <BehindWorkflowLayer />
        <DemoTheater />
        <SampleReportPreview />
        <RoleBasedBenefits />
        <ClosingSection>
          <CTASectionHIW />
          <Footer />
        </ClosingSection>
      </main>
    </>
  );
}
