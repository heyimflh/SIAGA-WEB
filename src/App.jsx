import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import DroneAnatomy from './components/DroneAnatomy';
import ProblemSolution from './components/ProblemSolution';
import { JobRadarSection } from './components/JobRadarMap';
import HowItWorks from './components/HowItWorks';
import SektorKredibilitas from './components/SektorKredibilitas';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import ClosingSection from './components/ClosingSection';
import CustomCursor from './components/CustomCursor';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
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

    // Sync Lenis ↔ GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use requestAnimationFrame for buttery smooth performance
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Fixed Background — grid + concentric circles, stays still while content scrolls */}
      <div className="fixed-bg" aria-hidden="true">
        <div className="fixed-bg__grid" />
        <div className="fixed-bg__circles" />
        <div className="fixed-bg__crosshairs" />
      </div>

      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <DroneAnatomy />
        <ProblemSolution />
        <JobRadarSection />
        <HowItWorks />
        <SektorKredibilitas />
        <ClosingSection>
          <FinalCTA />
          <Footer />
        </ClosingSection>
      </main>
    </>
  );
}

export default App;
