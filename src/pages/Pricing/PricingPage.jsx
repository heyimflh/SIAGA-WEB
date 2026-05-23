import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClosingSection from '../../components/ClosingSection';
import CinematicHeroPricing from './sections/CinematicHeroPricing';
import PricingTrustStrip from './sections/PricingTrustStrip';
import PricingCards from './sections/PricingCards';
import PlanRecommendationStrip from './sections/PlanRecommendationStrip';
import EscrowFlowConsole from './sections/EscrowFlowConsole';
import FeatureComparisonTable from './sections/FeatureComparisonTable';
import FAQKnowledgeBase from './sections/FAQKnowledgeBase';
import SecurityTrustBadges from './sections/SecurityTrustBadges';
import CTASectionPricing from './sections/CTASectionPricing';
import './PricingPage.css';

export default function PricingPage() {
 return (
 <>
 <Navbar />
 <main className="pricing-page">
 <CinematicHeroPricing />
 <PricingTrustStrip />
 <PricingCards />
 <PlanRecommendationStrip />
 <EscrowFlowConsole />
 <FeatureComparisonTable />
 <FAQKnowledgeBase />
 <SecurityTrustBadges />
 <ClosingSection>
 <CTASectionPricing />
 <Footer />
 </ClosingSection>
 </main>
 </>
 );
}
