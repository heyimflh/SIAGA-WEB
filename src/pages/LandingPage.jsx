import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HeroMobileTablet from '../components/HeroMobileTablet';
import StatsBar from '../components/StatsBar';
import { useMediaQuery } from '../hooks/useMediaQuery';
import DualAudience from '../components/DualAudience/DualAudience';
import ProblemSolution from '../components/ProblemSolution';
import { JobRadarSection, JobRadarMobileTablet } from '../components/JobRadarMap';
import LiveProjects from '../components/LiveProjects/LiveProjects';
import FeaturedPilots from '../components/FeaturedPilots/FeaturedPilots';
import ServiceCategories from '../components/ServiceCategories/ServiceCategories';
import HowItWorks from '../components/HowItWorks';
import TrustSafety from '../components/TrustSafety/TrustSafety';
import SektorKredibilitas from '../components/SektorKredibilitas';
import Pricing from '../components/Pricing/Pricing';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import ClosingSection from '../components/ClosingSection';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
 const isDesktop = useMediaQuery('(min-width: 1024px)');

 useEffect(() => {
 const lenis = new Lenis({
 duration: 1.0,
 easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
 direction: 'vertical',
 gestureDirection: 'vertical',
 smooth: true,
 mouseMultiplier: 0.8,
 smoothTouch: false,
 touchMultiplier: 1.8,
 infinite: false,
 });

 lenis.on('scroll', ScrollTrigger.update);

 let rafId;
 function raf(time) {
 lenis.raf(time);
 rafId = requestAnimationFrame(raf);
 }
 rafId = requestAnimationFrame(raf);

 return () => {
 cancelAnimationFrame(rafId);
 lenis.destroy();
 ScrollTrigger.getAll().forEach((t) => t.kill());
 };
 }, []);

 return (
 <>
 <div className="fixed-bg" aria-hidden="true">
 <div className="fixed-bg__grid" />
 <div className="fixed-bg__circles" />
 <div className="fixed-bg__crosshairs" />
 </div>

 <Navbar />
 <main>
 {isDesktop ? <Hero /> : <HeroMobileTablet />}
 <StatsBar />
 <DualAudience />
 <ProblemSolution />
 {isDesktop ? <JobRadarSection /> : <JobRadarMobileTablet />}
 <LiveProjects />
 <FeaturedPilots />
 <ServiceCategories />
 <HowItWorks />
 <TrustSafety />
 <SektorKredibilitas />
 <Pricing />
 <ClosingSection>
 <FinalCTA />
 <Footer />
 </ClosingSection>
 </main>
 </>
 );
}
